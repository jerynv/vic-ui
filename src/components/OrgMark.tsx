import { useState, type ReactNode } from "react";
import { hueFor } from "./hue";

/**
 * A place drawn as itself (an organisation, a team, a workspace): its first letter on a tile
 * in its own colour (`hueFor`), the letter in that colour's ink, or its logo (`src`, an image
 * address) in exactly the letter's box.
 */
export function OrgMark(props: { name: string; slug: string; src?: string | null | undefined; size?: "sm" | "lg"; className?: string }) {
  const logo = useLogo(props.src);
  return (
    <span className={["ui-org-mark", props.size === "lg" ? "ui-org-mark-lg" : "", props.className ?? ""].filter(Boolean).join(" ")} data-hue={hueFor(props.slug)} data-logo={logo.shown ? "" : undefined} aria-hidden="true">
      {props.name.trim().charAt(0).toUpperCase()}
      {logo.image}
    </span>
  );
}

/**
 * The logo over a letter tile, for `OrgMark` and any tile of your own drawn the same way: the letter
 * stands until the picture has loaded and stays if it fails, and the picture fills the tile
 * contained, so neither changes the tile's size and nothing moves. `shown` goes on the tile as
 * `data-logo`, which hides the letter and the tile's colour behind it. The tile is
 * `aria-hidden` with the name beside it, so the picture says nothing either.
 */
export function useLogo(src: string | null | undefined): { shown: boolean; image: ReactNode } {
  const [loaded, setLoaded] = useState<string | null>(null);
  if (!src) return { shown: false, image: null };
  // A logo this page has already drawn is shown at once where it is drawn again, rather than its letter for a frame.
  const shown = loaded === src || LOADED.has(src);
  return {
    shown,
    image: (
      <img
        key={src}
        className="ui-org-logo"
        src={src}
        alt=""
        decoding="async"
        onLoad={() => {
          LOADED.add(src);
          setLoaded(src);
        }}
        onError={() => {
          LOADED.delete(src);
          setLoaded(null);
        }}
      />
    ),
  };
}

/** Every logo address this page has loaded. Its revision is in the address, so what loaded once stays true. */
const LOADED = new Set<string>();
