/** Adapted from V-Client zipread.ts at 2f2713d8; provenance in THIRD_PARTY_NOTICES.md. */
export const OFFICE_LIMITS = Object.freeze({
  maxBytes: 10 * 1024 * 1024, maxEntries: 512, maxPartBytes: 8 * 1024 * 1024,
  maxTotalBytes: 32 * 1024 * 1024, maxXmlBytes: 4 * 1024 * 1024, maxXmlNodes: 100_000,
});
export type OfficeInput = Blob | Uint8Array<ArrayBuffer>;
const fail = (message: string): never => { throw new Error(message); };
export function officeLimit(value: number | undefined, ceiling: number): number {
  return value === undefined || !Number.isFinite(value) ? ceiling : Math.max(1, Math.min(ceiling, Math.floor(value)));
}
function checkAbort(signal?: AbortSignal) {
  if (signal?.aborted) { const error = new Error("Preview cancelled."); error.name = "AbortError"; throw error; }
}
const crcTable = Uint32Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  return crc >>> 0;
});
function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255]! ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function safePath(name: string): boolean {
  const path = name.endsWith("/") ? name.slice(0, -1) : name;
  return path.length > 0 && path.length <= 512 && !/[\\:%?#\x00-\x1f\x7f]/.test(path)
    && path.split("/").every(part => part !== "" && part !== "." && part !== "..");
}
interface Entry { name: string; start: number; end: number; method: number; size: number; crc: number; directory: boolean }
function directory(bytes: Uint8Array<ArrayBuffer>): Entry[] {
  if (bytes.length < 22) fail("This is not a supported Office ZIP file.");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let end = -1;
  for (let at = bytes.length - 22; at >= Math.max(0, bytes.length - 22 - 65535); at--) {
    if (view.getUint32(at, true) === 0x06054b50 && at + 22 + view.getUint16(at + 20, true) === bytes.length) { end = at; break; }
  }
  if (end < 0) fail("The Office archive directory is missing or truncated.");
  const count = view.getUint16(end + 10, true), offset = view.getUint32(end + 16, true), size = view.getUint32(end + 12, true);
  if (view.getUint16(end + 4, true) || view.getUint16(end + 6, true) || view.getUint16(end + 8, true) !== count || count === 0xffff || offset === 0xffffffff || size === 0xffffffff) fail("Multi-volume and ZIP64 Office files are not supported.");
  if (count > OFFICE_LIMITS.maxEntries) fail(`Office files may contain at most ${OFFICE_LIMITS.maxEntries} archive entries.`);
  if (offset + size !== end) fail("The Office archive directory has invalid bounds.");
  const entries: Entry[] = [], intervals: Array<[number, number]> = [], names = new Set<string>();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let cursor = offset, total = 0;
  const extra = (start: number, length: number) => {
    let at = start;
    while (at < start + length) {
      if (at + 4 > start + length) fail("Invalid Office ZIP extra field.");
      const tag = view.getUint16(at, true), fieldSize = view.getUint16(at + 2, true);
      if (tag === 1 || tag === 0x7075) fail("ZIP64 and alternate Unicode ZIP paths are not supported.");
      at += 4 + fieldSize;
      if (at > start + length) fail("Truncated Office ZIP extra field.");
    }
  };
  for (let index = 0; index < count; index++) {
    if (cursor + 46 > end || view.getUint32(cursor, true) !== 0x02014b50) fail("Invalid Office archive entry.");
    const flags = view.getUint16(cursor + 8, true), method = view.getUint16(cursor + 10, true);
    const crc = view.getUint32(cursor + 16, true), packed = view.getUint32(cursor + 20, true), unpacked = view.getUint32(cursor + 24, true);
    const nameLength = view.getUint16(cursor + 28, true), extraLength = view.getUint16(cursor + 30, true);
    const next = cursor + 46 + nameLength + extraLength + view.getUint16(cursor + 32, true);
    const local = view.getUint32(cursor + 42, true), attributes = view.getUint32(cursor + 38, true);
    if (next > end || !nameLength || view.getUint16(cursor + 34, true) !== 0 || local === 0xffffffff || packed === 0xffffffff || unpacked === 0xffffffff) fail("Invalid or ZIP64 Office archive entry.");
    if (flags & ~0x080e || (method !== 0 && method !== 8) || (method === 0 && (flags & 6))) fail("Encrypted or unsupported Office ZIP compression.");
    if ((attributes >>> 16 & 0xf000) === 0xa000) fail("Office archives cannot contain symbolic links.");
    const rawName = bytes.subarray(cursor + 46, cursor + 46 + nameLength);
    const name = decoder.decode(rawName);
    if (!safePath(name) || names.has(name)) fail("Office archive paths must be safe and unique.");
    names.add(name); extra(cursor + 46 + nameLength, extraLength);
    const isDirectory = name.endsWith("/");
    if (unpacked > OFFICE_LIMITS.maxPartBytes || packed > OFFICE_LIMITS.maxBytes) fail("An Office archive part exceeds the 8 MiB expanded budget.");
    total += unpacked;
    if (total > OFFICE_LIMITS.maxTotalBytes) fail("The Office archive exceeds the 32 MiB expanded budget.");
    if (isDirectory && unpacked !== 0) fail("An Office archive directory contains data.");
    if (local + 30 > offset || view.getUint32(local, true) !== 0x04034b50) fail("Invalid Office ZIP local record.");
    if (view.getUint16(local + 6, true) !== flags || view.getUint16(local + 8, true) !== method) fail("Conflicting Office ZIP local record.");
    const localNameSize = view.getUint16(local + 26, true), localExtraSize = view.getUint16(local + 28, true);
    const start = local + 30 + localNameSize + localExtraSize, stop = start + packed;
    if (stop > offset || localNameSize !== nameLength || !rawName.every((byte, at) => byte === bytes[local + 30 + at])) fail("Invalid Office ZIP local name or data bounds.");
    extra(local + 30 + localNameSize, localExtraSize);
    const localCrc = view.getUint32(local + 14, true), localPacked = view.getUint32(local + 18, true), localUnpacked = view.getUint32(local + 22, true);
    let recordEnd = stop;
    if (flags & 8) {
      if ((localCrc && localCrc !== crc) || (localPacked && localPacked !== packed) || (localUnpacked && localUnpacked !== unpacked)) fail("Conflicting Office ZIP data descriptor.");
      const signed = stop + 4 <= offset && view.getUint32(stop, true) === 0x08074b50;
      const descriptor = stop + (signed ? 4 : 0);
      recordEnd = descriptor + 12;
      if (recordEnd > offset || view.getUint32(descriptor, true) !== crc || view.getUint32(descriptor + 4, true) !== packed || view.getUint32(descriptor + 8, true) !== unpacked) fail("Invalid Office ZIP data descriptor.");
    } else if (localCrc !== crc || localPacked !== packed || localUnpacked !== unpacked) fail("Conflicting Office ZIP sizes or checksum.");
    if (method === 0 && packed !== unpacked) fail("Stored Office ZIP sizes do not match.");
    intervals.push([local, recordEnd]);
    entries.push({ name, start, end: stop, method, size: unpacked, crc, directory: isDirectory });
    cursor = next;
  }
  if (cursor !== end) fail("The Office ZIP directory size does not match its entries.");
  intervals.sort((a, b) => a[0] - b[0]);
  for (let at = 0; at < intervals.length; at++) {
    if (at === 0 && intervals[at]![0] !== 0 || at > 0 && intervals[at]![0] < intervals[at - 1]![1]) fail("Office ZIP records overlap or contain an unsupported prefix.");
  }
  return entries;
}
async function inflate(raw: Uint8Array<ArrayBuffer>, expected: number, signal?: AbortSignal): Promise<Uint8Array<ArrayBuffer>> {
  if (typeof DecompressionStream === "undefined") fail("This browser cannot decompress Office previews.");
  let decompressor: DecompressionStream;
  try { decompressor = new DecompressionStream("deflate-raw"); }
  catch { return fail("This browser cannot decompress Office previews."); }
  const reader = new Blob([raw]).stream().pipeThrough(decompressor).getReader();
  const abort = () => { void reader.cancel().catch(() => {}); };
  signal?.addEventListener("abort", abort, { once: true });
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let length = 0;
  try {
    for (;;) {
      checkAbort(signal);
      const { done, value } = await reader.read();
      checkAbort(signal);
      if (done) break;
      length += value.byteLength;
      if (length > expected || length > OFFICE_LIMITS.maxPartBytes) fail("An Office archive part expands beyond its declared budget.");
      chunks.push(value);
    }
    if (length !== expected) fail("An Office archive part has an incorrect expanded size.");
    const bytes = new Uint8Array(length);
    let cursor = 0;
    for (const chunk of chunks) { bytes.set(chunk, cursor); cursor += chunk.length; }
    return bytes;
  } finally {
    signal?.removeEventListener("abort", abort);
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
/** Validate the entire archive before an optional third-party renderer can read it. */
export async function readOfficeArchive(input: OfficeInput, options?: { maxBytes?: number }, signal?: AbortSignal): Promise<Map<string, Uint8Array<ArrayBuffer>>> {
  checkAbort(signal);
  const limit = officeLimit(options?.maxBytes, OFFICE_LIMITS.maxBytes);
  const length = input instanceof Uint8Array ? input.byteLength : input.size;
  if (length > limit) fail(`Office previews accept at most ${limit.toLocaleString("en-US")} encoded bytes.`);
  const bytes = input instanceof Uint8Array ? new Uint8Array(input) : new Uint8Array(await input.arrayBuffer());
  checkAbort(signal);
  if (bytes.byteLength > limit) fail("The Office input exceeds its encoded byte budget.");
  const entries = directory(bytes), result = new Map<string, Uint8Array<ArrayBuffer>>();
  for (const entry of entries) {
    checkAbort(signal);
    const raw = bytes.subarray(entry.start, entry.end);
    const data = entry.method === 0 ? raw.slice() : await inflate(raw, entry.size, signal);
    checkAbort(signal);
    if (data.length !== entry.size || crc32(data) !== entry.crc) fail("An Office archive part failed its size or checksum check.");
    if (!entry.directory) result.set(entry.name, data);
  }
  return result;
}
/** Bounded UTF-8 XML only. No DTD/entity declarations or deep/unbounded node trees. */
export function parseOfficeXml(bytes: Uint8Array<ArrayBuffer>): Document {
  if (bytes.byteLength > OFFICE_LIMITS.maxXmlBytes) fail("An Office XML part exceeds the 4 MiB parser budget.");
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (/<!\s*(DOCTYPE|ENTITY)/i.test(text)) fail("Office XML declarations cannot define entities or document types.");
  let markers = 0;
  for (const character of text) if (character === "<" && ++markers > OFFICE_LIMITS.maxXmlNodes / 2) fail("Office XML exceeds the node budget.");
  if (typeof DOMParser === "undefined") fail("Office previews require a browser XML parser.");
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.getElementsByTagName("parsererror").length) fail("An Office XML part is malformed.");
  let count = 0;
  const stack: Array<{ node: Node; depth: number }> = [{ node: doc, depth: 0 }];
  while (stack.length) {
    const { node, depth } = stack.pop()!;
    if (++count > OFFICE_LIMITS.maxXmlNodes || depth > 128) fail("Office XML exceeds the node or nesting budget.");
    for (let child = node.lastChild; child; child = child.previousSibling) stack.push({ node: child, depth: depth + 1 });
  }
  return doc;
}
