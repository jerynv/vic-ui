import { useState, type CSSProperties } from "react";
import { Button } from "vic-ui";
import { Button as ComposableButton } from "vic-ui/ui";

export const title = "Custom accent";
export const note = "Set --button-accent and --button-on-accent, then opt in with tone=\"accent\". The rim and all three face states stay coordinated. Hover, press or tab through either API.";
const hues = [["Red", 25], ["Amber", 80], ["Green", 145], ["Blue", 240], ["Purple", 300]] as const;

export default function Example() {
  const [contrast, setContrast] = useState(false);
  const [last, setLast] = useState("Choose a color to try the action.");
  return <div className="demo-stack" style={{ width: "100%", maxWidth: "none" }}>
    <Button look="line" aria-pressed={contrast} onClick={() => setContrast(!contrast)}>High contrast</Button>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))", gap: "1rem" }}>
      {(["light", "dark"] as const).map(mode => <section key={mode} data-mode={mode} aria-label={`${mode} accent buttons`}
        style={{ background: "var(--bg-base)", color: "var(--fg)", padding: "1rem", borderRadius: "var(--radius-panel)" }}>
        <h4 style={{ marginBottom: "1rem" }}>{mode === "light" ? "Light" : "Dark"}</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: ".5rem" }}>
          <span>Native</span><span>Composable</span>
          {hues.map(([name, hue]) => <div key={name} style={{ display: "contents",
            "--button-accent": `light-dark(oklch(${contrast ? ".43" : ".5"} .075 ${hue}), oklch(${contrast ? ".82" : ".74"} .075 ${hue}))`,
            "--button-on-accent": "light-dark(oklch(.97 0 0), oklch(.205 0 0))",
          } as CSSProperties}>
            <Button tone="accent" full onClick={() => setLast(`${name}, ${mode}, native button pressed.`)}>{name}</Button>
            <ComposableButton tone="accent" full onClick={() => setLast(`${name}, ${mode}, composable button pressed.`)}>{name}</ComposableButton>
          </div>)}
        </div>
      </section>)}
    </div>
    <p role="status">{last}</p>
  </div>;
}
