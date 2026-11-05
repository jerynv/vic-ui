import { useState, type CSSProperties } from "react";
import { ActionBar, Button } from "vic-ui";
import { Button as ComposableButton } from "vic-ui/ui";
import { ArrowUpIcon, PlusIcon } from "vic-ui/icons";

export const title = "Corners and compact controls";
export const note = "Rounded rectangles, circles and compact actions share concentric rim and face corners. Try the quiet Add button on hover, or the accented Send button in either theme.";

export default function Example() {
  const [last, setLast] = useState("Choose an action to try its pressed state.");
  return <div className="demo-stack" style={{ width: "100%", maxWidth: "none" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 17rem), 1fr))", gap: "1rem" }}>
      {(["light", "dark"] as const).map(mode => <section key={mode} data-mode={mode} aria-label={`${mode} button shapes`}
        style={{ background: "var(--bg-base)", color: "var(--fg)", padding: "1rem", borderRadius: "var(--radius-panel)",
          "--button-accent": "light-dark(oklch(.5 .075 240), oklch(.74 .075 240))",
          "--button-on-accent": "light-dark(oklch(.97 0 0), oklch(.205 0 0))",
        } as CSSProperties}>
        <h4 style={{ marginBottom: "1rem" }}>{mode === "light" ? "Light" : "Dark"}</h4>
        <div className="demo-stack">
          <span>Native</span>
          <div className="demo-row">
            <Button tone="accent" onClick={() => setLast(`${mode}: native save pressed.`)}>Save</Button>
            <Button look="line" square aria-label={`${mode} native square Add`} icon={<PlusIcon size={16} />} onClick={() => setLast(`${mode}: native square Add pressed.`)} />
            <Button look="quiet" square round aria-label={`${mode} native round Add`} icon={<PlusIcon size={16} />} onClick={() => setLast(`${mode}: native round Add pressed.`)} />
            <Button tone="accent" square round aria-label={`${mode} native Send`} icon={<ArrowUpIcon size={16} />} onClick={() => setLast(`${mode}: native Send pressed.`)} />
          </div>
          <span>Composable</span>
          <div className="demo-row">
            <ComposableButton tone="accent" onClick={() => setLast(`${mode}: composable save pressed.`)}>Save</ComposableButton>
            <ComposableButton variant="outline" size="icon" aria-label={`${mode} composable square Add`} onClick={() => setLast(`${mode}: composable square Add pressed.`)}><PlusIcon size={16} /></ComposableButton>
            <ComposableButton variant="ghost" size="icon" round aria-label={`${mode} composable round Add`} onClick={() => setLast(`${mode}: composable round Add pressed.`)}><PlusIcon size={16} /></ComposableButton>
            <ComposableButton tone="accent" size="icon" round aria-label={`${mode} composable Send`} onClick={() => setLast(`${mode}: composable Send pressed.`)}><ArrowUpIcon size={16} /></ComposableButton>
          </div>
          <span>Compact toolbar</span>
          <div className="demo-row"><ActionBar aria-label={`${mode} compact actions`}>
            <Button look="quiet" square aria-label={`${mode} compact Add`} icon={<PlusIcon size={16} />} onClick={() => setLast(`${mode}: compact Add pressed.`)} />
            <Button look="quiet" square round aria-label={`${mode} compact round Add`} icon={<PlusIcon size={16} />} onClick={() => setLast(`${mode}: compact round Add pressed.`)} />
            <Button tone="accent" square round aria-label={`${mode} compact Send`} icon={<ArrowUpIcon size={16} />} onClick={() => setLast(`${mode}: compact Send pressed.`)} />
          </ActionBar></div>
        </div>
      </section>)}
    </div>
    <p role="status">{last}</p>
  </div>;
}
