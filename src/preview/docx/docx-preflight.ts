const parsedKinds = new Set("officeDocument fontTable numbering styles theme footnotes endnotes footer header core-properties extended-properties custom-properties settings comments commentsExtended".split(" "));
const all = (document: Document, name: string) => Array.from(document.getElementsByTagNameNS("*", name));
export const docxAttribute = (node: Element | undefined, name: string) => node && Array.from(node.attributes).find(attribute => attribute.localName === name)?.value;
const refuse = (message: string): never => { throw new Error(message); };

export const DOCX_NUMBERING_LIMITS = { abstracts: 128, instances: 256, expandedLevels: 512, levelChars: 8192, expandedChars: 262144 } as const;

/** Match the pinned renderer's URL-based OPC resolution without opening any URL. */
export function docxPartTarget(directory: string, target: string) {
  const url = new URL(target, `https://vic.invalid/${directory}`);
  if (url.origin !== "https://vic.invalid" || url.search || url.hash) refuse("This DOCX contains an unsupported part target.");
  return url.pathname.slice(1);
}

/** Only parts that have passed XML preflight may reach the dependency's relationship-selected parsers. */
export function docxPartRoles(xml: Map<string, Document>) {
  const roles = new Map<string, string>();
  let relationships = 0;
  for (const [name, document] of xml) {
    if (!name.endsWith(".rels")) continue;
    const directory = name === "_rels/.rels" ? "" : name.slice(0, name.lastIndexOf("_rels/"));
    const ids = new Set<string>();
    for (const relation of all(document, "Relationship")) {
      if (++relationships > 2048) refuse("This DOCX exceeds the 2,048-relationship budget.");
      const id = docxAttribute(relation, "Id") ?? "";
      if (!id || id.length > 128 || ids.has(id)) refuse("This DOCX contains an invalid or duplicate relationship identifier.");
      ids.add(id);
      const kind = docxAttribute(relation, "Type")?.split("/").pop() ?? "";
      if (!parsedKinds.has(kind)) continue;
      const target = docxPartTarget(directory, docxAttribute(relation, "Target") ?? "");
      if (!/\.xml$/i.test(target) || !xml.has(target)) refuse("DOCX parser relationships must target validated XML parts.");
      if (kind === "officeDocument" && (name !== "_rels/.rels" || target !== "word/document.xml" || roles.has(target))) refuse("DOCX previews require the canonical word/document.xml main part.");
      if (roles.has(target) && roles.get(target) !== kind) refuse("This DOCX assigns conflicting parser roles to one part.");
      roles.set(target, kind);
    }
  }
  return roles;
}

/** Bound the exact nums × matching abstract levels expansion performed by docx-preview before it allocates it. */
export function checkDocxNumbering(xml: Map<string, Document>, roles: Map<string, string>) {
  let abstracts = 0, instances = 0, expanded = 0, expandedChars = 0;
  const serializer = new XMLSerializer();
  for (const [name, document] of xml) {
    if (roles.get(name) !== "numbering" && document.documentElement.localName !== "numbering") continue;
    const levels = new Map<string, { count: number; chars: number }>();
    const validId = (value: string | null | undefined) => {
      if (!value || !/^\d{1,10}$/.test(value)) throw new Error("This DOCX contains an unsupported numbering identifier.");
      return value;
    };
    for (const abstract of all(document, "abstractNum")) {
      if (++abstracts > DOCX_NUMBERING_LIMITS.abstracts) refuse("This DOCX exceeds the numbering definition budget.");
      const id = validId(docxAttribute(abstract, "abstractNumId"));
      if (levels.has(id)) refuse("This DOCX contains duplicate numbering definitions.");
      let count = 0, chars = 0;
      const indexes = new Set<string>();
      for (const level of Array.from(abstract.children).filter(node => node.localName === "lvl")) {
        const index = docxAttribute(level, "ilvl") ?? "";
        if (!/^[0-8]$/.test(index) || indexes.has(index)) refuse("DOCX numbering supports unique levels 0 through 8.");
        indexes.add(index); count++;
        const weight = serializer.serializeToString(level).length;
        if (weight > DOCX_NUMBERING_LIMITS.levelChars) refuse("This DOCX exceeds the numbering level character budget.");
        chars += weight;
      }
      levels.set(id, { count, chars });
    }
    const ids = new Set<string>();
    for (const instance of all(document, "num")) {
      if (++instances > DOCX_NUMBERING_LIMITS.instances) refuse("This DOCX exceeds the numbering instance budget.");
      const id = validId(docxAttribute(instance, "numId"));
      if (ids.has(id)) refuse("This DOCX contains duplicate numbering instances.");
      ids.add(id);
      const reference = Array.from(instance.children).find(node => node.localName === "abstractNumId");
      const definition = levels.get(validId(docxAttribute(reference, "val") ?? null));
      if (!definition) throw new Error("This DOCX references an absent numbering definition.");
      expanded += definition.count; expandedChars += definition.chars + id.length * definition.count;
      if (expanded > DOCX_NUMBERING_LIMITS.expandedLevels || expandedChars > DOCX_NUMBERING_LIMITS.expandedChars) refuse("This DOCX exceeds the expanded numbering budget.");
    }
  }
}

/** Conservative page bound: explicit breaks/sections plus each paragraph when a style can force a page break. */
export function docxRepetition(xml: Map<string, Document>, roles: Map<string, string>, maxPages: number) {
  const main = xml.get("word/document.xml")!;
  const styles = new Map<string, Element[]>(), memo = new Map<string, boolean>();
  for (const [name, document] of xml) if (roles.get(name) === "styles") for (const style of all(document, "style")) {
    const id = docxAttribute(style, "styleId") ?? "";
    styles.set(id, [...styles.get(id) ?? [], style]);
  }
  const active = (node: Element) => !/^(?:0|false|off)$/i.test(docxAttribute(node, "val") ?? "1");
  const breaks = (id: string, visiting = new Set<string>()): boolean => {
    if (memo.has(id)) return memo.get(id)!;
    if (visiting.has(id) || visiting.size >= 128) refuse("This DOCX contains cyclic or excessive style inheritance.");
    const next = new Set(visiting).add(id);
    const result = (styles.get(id) ?? []).some(style => Array.from(style.getElementsByTagNameNS("*", "pageBreakBefore")).some(active)
      || Array.from(style.getElementsByTagNameNS("*", "basedOn")).some(base => breaks(docxAttribute(base, "val") ?? "", next)));
    memo.set(id, result); return result;
  };
  const styleBreaks = all(main, "pStyle").filter(node => breaks(docxAttribute(node, "val") ?? "")).length;
  const pages = 1 + all(main, "sectPr").length + all(main, "br").filter(node => docxAttribute(node, "type") === "page").length
    + styleBreaks + all(main, "pageBreakBefore").filter(active).length;
  if (pages > maxPages) refuse("This DOCX exceeds the conservative 100-page work budget.");
  const references = [...xml.values()].reduce((count, document) => count + all(document, "footnoteReference").length + all(document, "endnoteReference").length, 0);
  return (part: string) => {
    const role = roles.get(part);
    return role === "header" || role === "footer" ? pages : role === "footnotes" || role === "endnotes" ? Math.max(1, references) * pages : 1;
  };
}
