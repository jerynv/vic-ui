import { Children, isValidElement, type CSSProperties, type ReactNode } from "react";

/**
 * Faces overlapping in a row, the first `most` of them and then `+n` for the rest, counted
 * from `total` where the children are only the head of them. Any face node goes in (a
 * `PersonFace`, an `OrgMark`); each after the first is cut back by the outline of the one
 * before it, grown by `gap`, so clear space shows on whatever is behind without naming its
 * colour. `shapes` gives each face's outline as an image whose opaque part is the face; a
 * face without one is round, as every face is (`--radius-round`). Ported from Kibo UI's Avatar Stack (MIT).
 */

/** A face's outline: a circle. */
const ROUND = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Ccircle cx='5' cy='5' r='5'/%3E%3C/svg%3E`;

function cutBy(shape: string, size: number, overlap: number, gap: number): CSSProperties {
  const grown = size + 2 * gap;
  const image = `url("${shape}"), linear-gradient(oklch(0 0 0) 0 0)`;
  const at = `${-(size - overlap) - gap}px ${-gap}px, 0 0`;
  const sized = `${grown}px ${grown}px, 100% 100%`;
  return {
    maskImage: image,
    maskPosition: at,
    maskSize: sized,
    maskRepeat: "no-repeat",
    maskComposite: "exclude",
    WebkitMaskImage: image,
    WebkitMaskPosition: at,
    WebkitMaskSize: sized,
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskComposite: "xor",
  };
}

export function AvatarStack(props: { children: ReactNode; size?: number; overlap?: number; gap?: number; most?: number; total?: number; shapes?: Array<string | undefined>; label?: string; className?: string }) {
  const size = props.size ?? 24;
  const overlap = props.overlap ?? Math.round(size / 3);
  const gap = props.gap ?? 2;
  const faces = Children.toArray(props.children).filter(isValidElement);
  const shown = faces.slice(0, props.most ?? 10);
  const more = Math.max(0, (props.total ?? faces.length) - shown.length);
  const box = (index: number): CSSProperties => ({ width: size, height: size, ...(index ? { marginLeft: -overlap, ...cutBy(props.shapes?.[index - 1] ?? ROUND, size, overlap, gap) } : {}) });
  return (
    <span className={props.className ? `ui-avatar-stack ${props.className}` : "ui-avatar-stack"} role={props.label ? "group" : undefined} aria-label={props.label}>
      {shown.map((face, index) => (
        <span key={face.key ?? index} className="ui-avatar-stack-face" style={box(index)}>
          {face}
        </span>
      ))}
      {more > 0 ? (
        <span className="ui-avatar-stack-face ui-avatar-stack-more" style={{ ...box(shown.length), fontSize: size < 28 ? "var(--text-tag)" : "var(--text-meta)" }}>
          <span aria-hidden="true">+{more}</span>
          <span className="sr-only">and {more} more</span>
        </span>
      ) : null}
    </span>
  );
}
