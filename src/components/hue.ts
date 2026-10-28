/**
 * A place's colour: one of the palette's five hues (`tokens.css`), chosen by hashing what
 * names it, so a place is the same colour everywhere it appears. Set on an element as
 * `data-hue`, which hands its children `--hue` and `--hue-ink`.
 */
export const HUES = ["sky", "sage", "butter", "lilac", "clay"] as const;
export type Hue = (typeof HUES)[number];

export function hueFor(seed: string): Hue {
  // FNV-1a, salted so the hue does not simply follow the painting's index.
  let hash = 0x811c9dc5;
  for (const char of `hue:${seed}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  return HUES[(hash >>> 0) % HUES.length] as Hue;
}
