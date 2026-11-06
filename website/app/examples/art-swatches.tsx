import type { CSSProperties } from "react";

// The four art hues and the grain, in both modes: each hue alone, then a banner that runs
// through all four under a dot overlay at `--art-grain`. Art lives only inside thumbnails,
// banners and illustrations; no control reads these tokens.
const grain: CSSProperties = {
  backgroundImage: "radial-gradient(color-mix(in oklab, var(--fg-strong) calc(var(--art-grain) * 100%), transparent) 1px, transparent 1px)",
  backgroundSize: "4px 4px",
};

function Art({ mode }: { mode: "light" | "dark" }) {
  return (
    <section data-mode={mode} aria-label={`${mode} art`} className="grid gap-3 rounded-(--radius-panel) p-4" style={{ background: "var(--bg-canvas)", color: "var(--fg)", boxShadow: "var(--edge)" }}>
      <h4 className="text-sm font-medium">{mode === "light" ? "Light" : "Dark"}</h4>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="grid gap-1 text-xs">
            <div className="h-12 rounded-(--radius-row)" style={{ background: `var(--art-${n})` }} />
            <code>--art-{n}</code>
          </div>
        ))}
      </div>
      <div className="relative h-20 overflow-hidden rounded-(--radius-row)" style={{ background: "linear-gradient(120deg, var(--art-1), var(--art-2) 35%, var(--art-3) 70%, var(--art-4))" }}>
        <div aria-hidden="true" className="absolute inset-0" style={grain} />
      </div>
      <p className="text-xs" style={{ color: "var(--fg-subtle)" }}>A banner: the four hues under a dot overlay at --art-grain.</p>
    </section>
  );
}

export default function ArtSwatches() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <Art mode="light" />
      <Art mode="dark" />
    </div>
  );
}
