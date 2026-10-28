/**
 * The site measures contrast from the tokens as the browser resolves them, in each mode, so the
 * numbers on the page are the page's own and not copied from anywhere. WCAG 2 relative luminance
 * from linear sRGB, out of gamut clamped as a screen clamps it.
 */

type Linear = [number, number, number];

function fromOklab(L: number, a: number, b: number): Linear {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** A computed colour as linear sRGB and its alpha, or null where it cannot be read. */
export function parse(colour: string): { rgb: Linear; alpha: number } | null {
  const text = colour.trim();
  const inner = text.match(/^([a-z]+)\((.*)\)$/i);
  if (!inner) return null;
  const [, fn, body] = inner;
  const [main, alphaPart] = (body ?? "").split("/");
  const parts = (main ?? "").replace(/,/g, " ").trim().split(/\s+/);
  const num = (part: string | undefined) => (part === undefined || part === "none" ? 0 : part.endsWith("%") ? parseFloat(part) / 100 : parseFloat(part));
  let alpha = alphaPart === undefined ? 1 : num(alphaPart.trim());
  switch (fn?.toLowerCase()) {
    case "oklch": {
      const L = num(parts[0]);
      const C = parseFloat(parts[1] ?? "0") || 0;
      const h = ((parseFloat(parts[2] ?? "0") || 0) * Math.PI) / 180;
      return { rgb: fromOklab(L, C * Math.cos(h), C * Math.sin(h)).map(clamp) as Linear, alpha };
    }
    case "oklab":
      return { rgb: fromOklab(num(parts[0]), parseFloat(parts[1] ?? "0"), parseFloat(parts[2] ?? "0")).map(clamp) as Linear, alpha };
    case "rgb":
    case "rgba": {
      if (fn.toLowerCase() === "rgba" && parts.length === 4) alpha = num(parts[3]);
      return { rgb: parts.slice(0, 3).map((p) => toLinear(clamp(p.endsWith("%") ? num(p) : parseFloat(p) / 255))) as Linear, alpha };
    }
    case "color": {
      if (parts[0] !== "srgb") return null;
      return { rgb: parts.slice(1, 4).map((p) => toLinear(clamp(num(p)))) as Linear, alpha };
    }
    default:
      return null;
  }
}

export function luminance(rgb: Linear): number {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

/** The contrast of two opaque colours, or null where either is translucent or unreadable. */
export function contrast(a: string, b: string): number | null {
  const one = parse(a);
  const two = parse(b);
  if (!one || !two || one.alpha < 1 || two.alpha < 1) return null;
  const [hi, lo] = [luminance(one.rgb), luminance(two.rgb)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** A colour as the hex it is shown as, for reading beside its oklch. */
export function hex(colour: string): string | null {
  const read = parse(colour);
  if (!read) return null;
  const out = read.rgb.map((c) => Math.round(clamp(toGamma(c)) * 255).toString(16).padStart(2, "0")).join("");
  return read.alpha < 1 ? `#${out} at ${Math.round(read.alpha * 100)}%` : `#${out}`;
}

/** What a token resolves to inside `scope` (an element carrying `data-mode`). */
export function resolve(scope: HTMLElement, token: string, as: "color" | "background-color" = "color"): string {
  const probe = document.createElement("span");
  probe.style.setProperty(as, `var(${token})`);
  scope.appendChild(probe);
  const value = getComputedStyle(probe).getPropertyValue(as);
  probe.remove();
  return value;
}
