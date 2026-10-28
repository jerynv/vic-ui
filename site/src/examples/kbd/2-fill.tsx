import { Kbd } from "vic-ui";

export const title = "On another ground";
export const note = "A key is flat: no bevel and no shadow. Its fill is its own colour at a low strength, so it reads on whatever ground it sits on; a surface that wants another sets --kbd-fill.";

export default function Example() {
  return (
    <div className="demo-row">
      <span data-hue="sky" style={{ background: "var(--hue)", color: "var(--hue-ink)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-control)" }}>
        Search <Kbd name="Command">{"⌘"}</Kbd>
        <Kbd>K</Kbd>
      </span>
      <span style={{ ["--kbd-fill" as string]: "var(--bg-tint)", padding: "0.5rem 0.75rem" }}>
        With --kbd-fill <Kbd>Esc</Kbd>
      </span>
    </div>
  );
}
