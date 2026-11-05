import { parseOfficeXml } from "./zip";
export type OfficeArchive = Map<string, Uint8Array<ArrayBuffer>>;
export function elements(root: Document | Element, local: string): Element[] {
  return Array.from(root.getElementsByTagNameNS("*", local));
}
export function xml(archive: OfficeArchive, name: string, optional = false): Document | null {
  const bytes = archive.get(name);
  if (!bytes) { if (optional) return null; throw new Error(`An Office document part is missing: ${name}.`); }
  return parseOfficeXml(bytes);
}
export function relId(element: Element): string | null {
  return element.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id") ?? element.getAttribute("r:id");
}
function resolvePart(from: string, target: string): string {
  if (/[\\:%?#\x00-\x1f\x7f]/.test(target)) throw new Error("Unsupported Office relationship target.");
  const parts = target.startsWith("/") ? [] : from.split("/").slice(0, -1);
  for (const part of target.replace(/^\//, "").split("/")) {
    if (part === "..") { if (!parts.length) throw new Error("Office relationship escapes its archive."); parts.pop(); }
    else if (part !== "." && part !== "") parts.push(part);
  }
  if (!parts.length) throw new Error("Office relationship has no target.");
  return parts.join("/");
}
export function relationships(archive: OfficeArchive, from: string): Map<string, string> {
  const slash = from.lastIndexOf("/"), path = `${from.slice(0, slash + 1)}_rels/${from.slice(slash + 1)}.rels`;
  const doc = xml(archive, path, true), result = new Map<string, string>();
  if (!doc) return result;
  for (const entry of elements(doc, "Relationship")) {
    const id = entry.getAttribute("Id"), target = entry.getAttribute("Target");
    if (!id || !target) throw new Error("An Office relationship is incomplete.");
    if (entry.getAttribute("TargetMode") === "External") continue;
    if (result.has(id)) throw new Error("Office relationships must have unique IDs.");
    result.set(id, resolvePart(from, target));
  }
  return result;
}
export function stringBudget(value: string, budget: { characters: number }, limit = 1_000_000): string {
  budget.characters += value.length;
  if (value.length > 16_384 || budget.characters > limit) throw new Error("Office preview text exceeds its character budget.");
  return value;
}
