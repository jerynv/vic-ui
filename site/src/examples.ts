import type { ComponentType } from "react";

/**
 * Every example under `examples/<piece>/<n>-<name>.tsx`. Each file is both the live example and
 * the snippet shown beside it (read as `?raw`), so the code on the page is the code that runs.
 * A file names itself with `export const title`, and may add `export const note`.
 */
export interface Example {
  key: string;
  title: string;
  note?: string;
  Demo: ComponentType;
  code: string;
}

const modules = import.meta.glob<{ default: ComponentType; title: string; note?: string }>("./examples/*/*.tsx", { eager: true });
const sources = import.meta.glob<string>("./examples/*/*.tsx", { eager: true, query: "?raw", import: "default" });

/** The file as a reader would copy it: without the lines that name it for this site. */
function shown(source: string): string {
  return source
    .replace(/^export const (title|note) = [^\n]*\n/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const byPiece = new Map<string, Example[]>();
for (const path of Object.keys(modules).sort()) {
  const [, piece] = path.match(/^\.\/examples\/([^/]+)\//) ?? [];
  const module = modules[path];
  if (!piece || !module) continue;
  const list = byPiece.get(piece) ?? [];
  list.push({ key: path, title: module.title, ...(module.note ? { note: module.note } : {}), Demo: module.default, code: shown(sources[path] ?? "") });
  byPiece.set(piece, list);
}

export function examplesOf(piece: string): Example[] {
  return byPiece.get(piece) ?? [];
}
