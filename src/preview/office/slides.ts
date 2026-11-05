/** Text-only slide extraction adapted from V-Client SlidesView.tsx at 2f2713d8. */
import { elements, relationships, relId, stringBudget, xml, type OfficeArchive } from "./xml";
export interface SlideText { title: string; lines: string[] }
export interface SlideDeck { slides: SlideText[]; totalSlides: number }
export const SLIDE_LIMITS = Object.freeze({ maxSlides: 100, maxParagraphs: 10_000, maxCharacters: 500_000 });
export function readSlides(archive: OfficeArchive, limit: number): SlideDeck {
  const presentation = xml(archive, "ppt/presentation.xml")!;
  if (presentation.documentElement.localName !== "presentation") throw new Error("This archive does not contain a PPTX presentation.");
  const slideNodes = elements(presentation, "sldId");
  if (!slideNodes.length || slideNodes.length > SLIDE_LIMITS.maxSlides) throw new Error("Presentations must contain between 1 and 100 slides for preview.");
  const rels = relationships(archive, "ppt/presentation.xml"), budget = { characters: 0 };
  let paragraphs = 0;
  const text = (node: Element) => {
    if (++paragraphs > SLIDE_LIMITS.maxParagraphs) throw new Error("The presentation exceeds the 10,000 text-paragraph budget.");
    return stringBudget(elements(node, "t").map(t => t.textContent ?? "").join("").trim(), budget, SLIDE_LIMITS.maxCharacters);
  };
  const slides = slideNodes.slice(0, limit).map(slide => {
    const id = relId(slide), part = id ? rels.get(id) : undefined;
    if (!part || !part.startsWith("ppt/")) throw new Error("A slide has no supported local relationship.");
    const doc = xml(archive, part)!;
    if (doc.documentElement.localName !== "sld") throw new Error("A slide part is invalid.");
    let title = "";
    const lines: string[] = [];
    for (const shape of elements(doc, "sp")) {
      const words = elements(shape, "p").filter(p => p.namespaceURI?.includes("drawingml")).map(text).filter(Boolean);
      const placeholder = elements(shape, "ph")[0]?.getAttribute("type");
      if ((placeholder === "title" || placeholder === "ctrTitle") && !title) title = words.join(" ");
      else lines.push(...words);
    }
    for (const frame of elements(doc, "graphicFrame")) for (const cell of elements(frame, "tc")) {
      const words = text(cell);
      if (words) lines.push(words);
    }
    return { title, lines };
  });
  return { slides, totalSlides: slideNodes.length };
}
