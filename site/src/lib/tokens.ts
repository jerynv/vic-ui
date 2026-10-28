import source from "../../../src/styles/tokens.css?raw";

/** A token's two values as written in `tokens.css`: `light-dark(light, dark)`, or one for both. */
export interface Written {
  light: string;
  dark: string;
}

/** Splits `a, b` at its one top level comma. */
function pair(inner: string): [string, string] | null {
  let depth = 0;
  for (let at = 0; at < inner.length; at++) {
    const char = inner[at];
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === "," && depth === 0) return [inner.slice(0, at).trim(), inner.slice(at + 1).trim()];
  }
  return null;
}

const WRITTEN = new Map<string, Written>();
for (const match of source.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gm)) {
  const [, name, value] = match;
  if (!name || !value || WRITTEN.has(name)) continue;
  const both = value.trim().match(/^light-dark\(([\s\S]*)\)$/);
  const split = both?.[1] ? pair(both[1]) : null;
  WRITTEN.set(name, split ? { light: split[0], dark: split[1] } : { light: value.trim(), dark: value.trim() });
}

export function written(token: string): Written {
  return WRITTEN.get(token) ?? { light: "", dark: "" };
}

export const TOKEN_SOURCE = source;
