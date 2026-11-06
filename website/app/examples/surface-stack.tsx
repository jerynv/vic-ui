import type { CSSProperties } from "react";

// The surface stack, bottom to top, drawn in both modes: each ground with the edge or shadow it
// carries, so the step from one to the next can be seen rather than read.
const STACK = [
  { token: "--bg-frame", name: "Frame", carry: "none" },
  { token: "--bg-canvas", name: "Canvas", carry: "none" },
  { token: "--bg-base", name: "Base", carry: "--edge" },
  { token: "--bg-tint", name: "Tint", carry: "none" },
  { token: "--bg-recessed", name: "Recessed", carry: "none" },
  { token: "--surface-lifted", name: "Lifted", carry: "--edge, or --shadow-float when it floats" },
  { token: "--bg-contrast", name: "Contrast", carry: "--shadow-raise" },
] as const;

function Stack({ mode }: { mode: "light" | "dark" }) {
  return (
    <section data-mode={mode} aria-label={`${mode} surface stack`} className="grid gap-2 rounded-(--radius-panel) p-4" style={{ background: "var(--bg-frame)", color: "var(--fg)", boxShadow: "var(--edge)" }}>
      <h4 className="text-sm font-medium">{mode === "light" ? "Light" : "Dark"}</h4>
      {STACK.map((step) => {
        const shadow = step.carry.startsWith("--edge") ? "var(--edge)" : step.carry === "--shadow-raise" ? "var(--shadow-raise)" : "none";
        const words = step.token === "--bg-contrast" ? "var(--fg-inverse)" : "var(--fg-strong)";
        return (
          <div key={step.token} className="flex min-w-0 items-center justify-between gap-3 rounded-(--radius-row) px-3 py-2 text-xs" style={{ background: `var(${step.token})`, boxShadow: shadow, color: words } as CSSProperties}>
            <span className="font-medium">{step.name}</span>
            <code className="truncate opacity-80">{step.token}</code>
          </div>
        );
      })}
    </section>
  );
}

export default function SurfaceStack() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <Stack mode="light" />
      <Stack mode="dark" />
    </div>
  );
}
