import type { HElement } from "docx-preview";
import { OFFICE_LIMITS, parseOfficeXml, readOfficeArchive } from "../office/zip";
import { checkDocxNumbering, docxAttribute, docxPartRoles, docxPartTarget, docxRepetition } from "./docx-preflight";

export const DOCX_LIMITS = {
  maxBytes: OFFICE_LIMITS.maxBytes, maxXmlBytes: 8 * 1024 * 1024,
  maxXmlNodes: 100_000, maxTextChars: 1_000_000, maxPages: 100,
  maxOutputNodes: 50_000, maxOutputChars: 8 * 1024 * 1024, maxStyleChars: 512 * 1024,
  maxImages: 100, maxImageBytes: 2 * 1024 * 1024, maxTotalImageBytes: 4 * 1024 * 1024,
  maxImagePixels: 4_000_000, maxTotalImagePixels: 8_000_000,
} as const;
const fail = (message: string): never => { throw new Error(message); };
const checkAbort = (signal: AbortSignal) => { if (signal.aborted) throw new DOMException("Preview cancelled", "AbortError"); };
const local = (root: Document, name: string) => Array.from(root.getElementsByTagNameNS("*", name));

/** Validate raster metadata before an image reaches any DOM node. Vector and legacy images are refused. */
function imageDimensions(bytes: Uint8Array, mime: string): [number, number] {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (mime === "image/png" && bytes.length >= 24 && [137,80,78,71,13,10,26,10].every((v, i) => bytes[i] === v) && new TextDecoder().decode(bytes.subarray(12, 16)) === "IHDR") {
    return [view.getUint32(16), view.getUint32(20)];
  }
  if (mime === "image/jpeg" && bytes[0] === 255 && bytes[1] === 216) {
    let at = 2;
    while (at + 4 <= bytes.length) {
      if (bytes[at++] !== 255) break;
      while (bytes[at] === 255) at++;
      const marker = bytes[at++];
      if (marker === 217 || marker === 218) break;
      if (marker === 1 || marker !== undefined && marker >= 208 && marker <= 215) continue;
      if (at + 2 > bytes.length) break;
      const length = view.getUint16(at);
      if (length < 2 || at + length > bytes.length) break;
      if ([192,193,194].includes(marker ?? 0) && length >= 8) return [view.getUint16(at + 5), view.getUint16(at + 3)];
      at += length;
    }
  }
  return fail("This DOCX contains an unsupported or invalid image. Only bounded PNG and JPEG images can be previewed.");
}

/** Re-encode the verified parts as stored ZIP records, so the dependency never sees unverified compression or paths. */
function storedZip(files: Map<string, Uint8Array<ArrayBuffer>>): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder();
  const records = [...files].map(([name, data]) => ({ name: encoder.encode(name), data }));
  const size = records.reduce((sum, file) => sum + 76 + 2 * file.name.length + file.data.length, 22);
  const output = new Uint8Array(size), view = new DataView(output.buffer);
  const central: { offset: number; crc: number; file: typeof records[number] }[] = [];
  let at = 0;
  for (const file of records) {
    let crc = 0xffffffff;
    for (const byte of file.data) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = crc >>> 1 ^ (crc & 1 ? 0xedb88320 : 0); }
    crc = (crc ^ 0xffffffff) >>> 0;
    central.push({ offset: at, crc, file });
    view.setUint32(at, 0x04034b50, true); view.setUint16(at + 4, 20, true); view.setUint16(at + 6, 0x800, true);
    view.setUint32(at + 14, crc, true); view.setUint32(at + 18, file.data.length, true); view.setUint32(at + 22, file.data.length, true);
    view.setUint16(at + 26, file.name.length, true); output.set(file.name, at + 30); output.set(file.data, at + 30 + file.name.length);
    at += 30 + file.name.length + file.data.length;
  }
  const directory = at;
  for (const { offset, crc, file } of central) {
    view.setUint32(at, 0x02014b50, true); view.setUint16(at + 4, 20, true); view.setUint16(at + 6, 20, true); view.setUint16(at + 8, 0x800, true);
    view.setUint32(at + 16, crc, true); view.setUint32(at + 20, file.data.length, true); view.setUint32(at + 24, file.data.length, true);
    view.setUint16(at + 28, file.name.length, true); view.setUint32(at + 42, offset, true); output.set(file.name, at + 46);
    at += 46 + file.name.length;
  }
  view.setUint32(at, 0x06054b50, true); view.setUint16(at + 8, central.length, true); view.setUint16(at + 10, central.length, true);
  view.setUint32(at + 12, at - directory, true); view.setUint32(at + 16, directory, true);
  return output;
}

export async function prepareDocx(input: Blob | Uint8Array<ArrayBuffer>, maxBytes: number | undefined, signal: AbortSignal) {
  const files = await readOfficeArchive(input, maxBytes === undefined ? {} : { maxBytes }, signal);
  checkAbort(signal);
  if (!files.has("word/document.xml") || !files.has("[Content_Types].xml")) fail("This file is not a supported DOCX document.");
  const xml = new Map<string, Document>();
  let xmlBytes = 0, nodes = 0, words = 0, cells = 0;
  const encoder = new TextEncoder();
  for (const [name, bytes] of files) {
    checkAbort(signal);
    if (/vbaProject|embeddings\/|activeX\//i.test(name)) fail("Embedded objects and macros cannot be previewed in DOCX.");
    if (!/\.xml$|\.rels$/i.test(name)) continue;
    xmlBytes += bytes.length;
    if (xmlBytes > DOCX_LIMITS.maxXmlBytes) fail("This DOCX exceeds the 8 MiB XML budget.");
    const document = parseOfficeXml(bytes);
    const elements = Array.from(document.getElementsByTagName("*"));
    nodes += elements.length; words += document.documentElement.textContent?.length ?? 0;
    if (nodes > DOCX_LIMITS.maxXmlNodes || words > DOCX_LIMITS.maxTextChars) fail("This DOCX exceeds the text or element budget.");
    for (const element of elements) {
      const attributes = new Set<string>();
      for (const attribute of Array.from(element.attributes)) {
        if (attribute.namespaceURI !== "http://www.w3.org/2000/xmlns/") {
          if (attributes.has(attribute.localName)) fail("This DOCX contains ambiguous attribute names.");
          attributes.add(attribute.localName);
        }
        if (["__proto__", "prototype", "constructor"].includes(attribute.value)) fail("This DOCX contains an unsafe identifier.");
      }
      if (/vml|svg/i.test(element.namespaceURI ?? "")) fail("Legacy VML and vector drawings cannot be previewed in DOCX.");
      if (["altChunk", "object", "OLEObject"].includes(element.localName)) fail("Embedded HTML and objects cannot be previewed in DOCX.");
      if (element.localName === "tc" && ++cells > 10_000) fail("This DOCX exceeds the 10,000 table-cell budget.");
      if (["gridSpan", "vMerge"].includes(element.localName)) {
        const value = docxAttribute(element, "val");
        if (value && /^\d+$/.test(value) && Number(value) > 100) fail("This DOCX contains an oversized table span.");
      }
    }
    if (name.endsWith(".rels")) {
      for (const relation of local(document, "Relationship")) {
        const target = docxAttribute(relation, "Target") ?? "";
        if (docxAttribute(relation, "TargetMode")?.toLowerCase() === "external" || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target)) {
          if (!(docxAttribute(relation, "Type") ?? "").endsWith("/hyperlink")) fail("External resources cannot be previewed in DOCX.");
          for (const attribute of Array.from(relation.attributes)) if (["Target", "TargetMode"].includes(attribute.localName)) relation.removeAttributeNode(attribute);
          relation.setAttribute("Target", "#");
        }
      }
      files.set(name, encoder.encode(new XMLSerializer().serializeToString(document)));
    }
    xml.set(name, document);
  }
  const main = xml.get("word/document.xml")!;
  if (main.documentElement.localName !== "document" || main.documentElement.namespaceURI !== "http://schemas.openxmlformats.org/wordprocessingml/2006/main") fail("This DOCX uses an unsupported document structure.");
  const roles = docxPartRoles(xml);
  checkDocxNumbering(xml, roles);
  const repetitions = docxRepetition(xml, roles, DOCX_LIMITS.maxPages);
  const contentTypes = xml.get("[Content_Types].xml")!;
  const defaults = new Map(local(contentTypes, "Default").map(node => [node.getAttribute("Extension")?.toLowerCase(), node.getAttribute("ContentType")]));
  const overrides = new Map(local(contentTypes, "Override").map(node => [node.getAttribute("PartName")?.replace(/^\//, ""), node.getAttribute("ContentType")]));
  let images = 0, imageBytes = 0, imagePixels = 0;
  const imageSizes = new Map<string, { bytes: number; pixels: number; width: number; height: number; mime: string }>();
  for (const [name, bytes] of files) {
    const mime = overrides.get(name) ?? defaults.get(name.split(".").pop()?.toLowerCase());
    if (/macroEnabled|vbaProject|oleObject|activeX/i.test(mime ?? "")) fail("Embedded objects and macros cannot be previewed in DOCX.");
    if (!mime?.startsWith("image/") && !name.startsWith("word/media/")) continue;
    if (++images > DOCX_LIMITS.maxImages || bytes.length > DOCX_LIMITS.maxImageBytes || (imageBytes += bytes.length) > DOCX_LIMITS.maxTotalImageBytes) fail("This DOCX exceeds the embedded-image budget.");
    const [width, height] = imageDimensions(bytes, mime ?? "");
    const pixels = width * height;
    if (width < 1 || height < 1 || pixels > DOCX_LIMITS.maxImagePixels || (imagePixels += pixels) > DOCX_LIMITS.maxTotalImagePixels) fail("This DOCX exceeds the embedded-image pixel budget.");
    imageSizes.set(name, { bytes: bytes.length, pixels, width, height, mime: mime ?? "" });
  }
  let placements = 0, placedBytes = 0, placedPixels = 0;
  for (const [part, document] of xml) {
    const slash = part.lastIndexOf("/"), directory = part.slice(0, slash + 1);
    const relations = xml.get(`${directory}_rels/${part.slice(slash + 1)}.rels`);
    for (const image of document.getElementsByTagNameNS("*", "blip")) {
      const id = docxAttribute(image, "embed");
      const target = relations && docxAttribute(local(relations, "Relationship").find(relation => docxAttribute(relation, "Id") === id), "Target");
      if (!target) fail("An embedded DOCX image has no supported relationship.");
      const size = imageSizes.get(docxPartTarget(directory, target!));
      if (!size) throw new Error("An embedded DOCX image has no supported raster data.");
      const repeat = repetitions(part);
      if ((placements += repeat) > DOCX_LIMITS.maxImages || (placedBytes += repeat * size.bytes) > DOCX_LIMITS.maxTotalImageBytes || (placedPixels += repeat * size.pixels) > DOCX_LIMITS.maxTotalImagePixels) fail("This DOCX exceeds the image placement budget.");
    }
  }
  for (const [name, { width, height, mime }] of imageSizes) {
    checkAbort(signal);
    if (typeof createImageBitmap !== "function") fail("This browser cannot validate embedded DOCX images.");
    const bitmap = await createImageBitmap(new Blob([files.get(name)!], { type: mime }));
    try {
      checkAbort(signal);
      if (bitmap.width !== width || bitmap.height !== height) fail("This DOCX contains conflicting image dimensions.");
    } finally { bitmap.close(); }
  }
  checkAbort(signal);
  return storedZip(files);
}

const HTML = new Set("div span p section article header footer table colgroup col tbody thead tr td th br hr wbr img sup sub a ol ul li style".split(" "));
const MATH = new Set("math mrow mfrac msqrt mroot msub msup msubsup mover munder munderover mi mn mo mtext mtable mtr mtd mmultiscripts mprescripts mphantom menclose mfenced mstyle".split(" "));
const HTML_NS = "http://www.w3.org/1999/xhtml", MATH_NS = "http://www.w3.org/1998/Math/MathML";

/** docx-preview 0.4.1's typed node factory is pinned and regression-tested. No node is created in the live host document. */
export function inertDocxFactory(document: Document, signal: AbortSignal) {
  let nodes = 0, text = 0, pages = 0, images = 0, imageBytes = 0, imagePixels = 0;
  let imageError: unknown;
  const make = (source: HElement | Node | string): Node => {
    checkAbort(signal);
    if (++nodes > DOCX_LIMITS.maxOutputNodes) fail("This DOCX exceeds the 50,000 rendered-node budget.");
    if (typeof source === "string") {
      if ((text += source.length) > DOCX_LIMITS.maxOutputChars) fail("This DOCX exceeds the rendered-text budget.");
      return document.createTextNode(source);
    }
    if (source instanceof Node) {
      if (source.ownerDocument !== document) fail("The DOCX renderer produced a node outside its isolated document.");
      return source;
    }
    const { tagName, ns, className, style, children, ...props } = source;
    if (tagName === "#comment") return document.createComment("");
    if (tagName === "#fragment") {
      const fragment = document.createDocumentFragment(); children?.forEach(child => fragment.appendChild(make(child))); return fragment;
    }
    if (!(ns === MATH_NS ? MATH : HTML).has(tagName) || ns && ns !== HTML_NS && ns !== MATH_NS) fail("This DOCX contains an unsupported drawing or element.");
    if (tagName === "section" && ++pages > DOCX_LIMITS.maxPages) fail("This DOCX exceeds the 100-page budget.");
    if (tagName === "img" && ++images > DOCX_LIMITS.maxImages) fail("This DOCX exceeds the 100-image placement budget.");
    const element = document.createElementNS(ns ?? HTML_NS, tagName) as HTMLElement;
    if (tagName === "img") {
      // The dependency sets src asynchronously after calling h. Validate that write before
      // any resource activates, and count repeated placements as well as unique ZIP parts.
      const source = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src")!;
      Object.defineProperty(element, "src", { get: () => source.get!.call(element), set: (value: unknown) => {
        try {
          checkAbort(signal);
          const match = typeof value === "string" && /^data:(image\/(?:png|jpeg));base64,([A-Za-z\d+/=]+)$/i.exec(value);
          if (!match) throw new Error("This DOCX contains an unsupported image source.");
          if (match[2]!.length > Math.ceil(DOCX_LIMITS.maxImageBytes / 3) * 4) fail("This DOCX exceeds the image placement byte budget.");
          const decoded = atob(match[2]!);
          if ((imageBytes += decoded.length) > DOCX_LIMITS.maxTotalImageBytes) fail("This DOCX exceeds the image placement byte budget.");
          const bytes = Uint8Array.from(decoded, character => character.charCodeAt(0));
          const [width, height] = imageDimensions(bytes, match[1]!.toLowerCase());
          if ((imagePixels += width * height) > DOCX_LIMITS.maxTotalImagePixels) fail("This DOCX exceeds the image placement pixel budget.");
          source.set!.call(element, value);
        } catch (error) { imageError ??= error; }
      } });
    }
    if (className) element.setAttribute("class", className);
    if (style) {
      if (typeof style === "string") element.style.cssText = style;
      else Object.assign(element.style, style);
    }
    for (const [name, value] of Object.entries(props)) {
      if (["id", "title", "alt", "start", "colSpan", "rowSpan"].includes(name) && value !== undefined) element.setAttribute(name, String(value));
    }
    children?.forEach(child => element.appendChild(make(child)));
    return element;
  };
  return Object.assign(make, { verify: () => { if (imageError) throw imageError; } });
}

/** Normalize CSS escapes before inspecting resource tokens; ordinary list suffixes use escaped tabs. */
function resourceStyle(text: string) {
  const normalized = text.replace(/\\(?:\r\n|[\n\r\f])/g, "").replace(/\\(?:([\da-f]{1,6})[ \t\r\n\f]?|([^\n\r\f]))/gi, (_, hex: string | undefined, character: string | undefined) => {
    const point = hex ? Number.parseInt(hex, 16) : 0;
    return hex ? point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff) ? String.fromCodePoint(point) : "\ufffd" : character ?? "";
  }).replace(/\/\*[\s\S]*?\*\//g, "");
  return /@import|@font-face|(?:url|(?:-webkit-)?image-set|image|src|paint|element|expression)\s*\(/i.test(normalized);
}

/** The browser activates only this serialized, sandboxed result, never the dependency's nodes. */
export function docxMarkup(body: HTMLElement, styles: HTMLElement) {
  let styleChars = 0;
  const head = Array.from(styles.querySelectorAll("style"), style => {
    const text = style.textContent ?? "";
    if ((styleChars += text.length) > DOCX_LIMITS.maxStyleChars) fail("This DOCX exceeds the stylesheet budget.");
    if (resourceStyle(text)) fail("This DOCX contains unsupported resource-bearing styles.");
    return `<style>${text.replace(/</g, "\\3c ")}</style>`;
  }).join("");
  for (const node of body.querySelectorAll("script,iframe,object,embed,form,link,meta,base,svg,video,audio,source,track")) node.remove();
  for (const element of body.querySelectorAll("*")) {
    for (const name of element.getAttributeNames()) {
      const value = element.getAttribute(name) ?? "";
      if (name.startsWith("on") || ["href", "xlink:href", "srcset", "poster", "data", "action", "formaction", "srcdoc", "ping", "background", "target"].includes(name)) element.removeAttribute(name);
      if (name === "src" && !(element.localName === "img" && /^data:image\/(?:png|jpeg);base64,[A-Za-z\d+/=]+$/i.test(value))) element.removeAttribute(name);
      if (name === "style" && resourceStyle(value)) element.removeAttribute(name);
    }
  }
  if (body.querySelector("img:not([src])")) fail("An embedded DOCX image could not be rendered.");
  const markup = body.innerHTML;
  if (markup.length + head.length > DOCX_LIMITS.maxOutputChars) fail("This DOCX exceeds the rendered-output character budget.");
  const sheet = body.querySelector<HTMLElement>("section.docx");
  const match = /^(\d+(?:\.\d+)?)(pt|px|in|cm|mm)$/.exec(sheet?.style.width ?? "");
  const scale: Record<string, number> = { pt: 96 / 72, px: 1, in: 96, cm: 96 / 2.54, mm: 96 / 25.4 };
  const width = match ? Number(match[1]) * scale[match[2]!]! : 816;
  if (width < 100 || width > 2000) fail("This DOCX has an unsupported page width.");
  return { head, body: markup, width };
}

export function docxFrame(head: string, body: string, zoom: number) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><meta name="referrer" content="no-referrer">${head}<style>html{color-scheme:light}html,body{margin:0;background:transparent}.docx-wrapper{background:transparent;padding:16px;zoom:${zoom}}.docx-wrapper>section.docx{margin-bottom:16px;box-shadow:none}img{max-width:100%;object-fit:contain}a{pointer-events:none}</style></head><body>${body}</body></html>`;
}
