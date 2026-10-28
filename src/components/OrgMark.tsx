import { hueFor } from "./hue";

/**
 * A place drawn as itself (an organisation, a team, a workspace): its first letter on a tile
 * in its own colour (`hueFor`), the letter in that colour's ink.
 */
export function OrgMark(props: { name: string; slug: string; size?: "sm" | "lg"; className?: string }) {
  return (
    <span className={["ui-org-mark", props.size === "lg" ? "ui-org-mark-lg" : "", props.className ?? ""].filter(Boolean).join(" ")} data-hue={hueFor(props.slug)} aria-hidden="true">
      {props.name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
