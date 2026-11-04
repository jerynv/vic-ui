import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { SearchField, Select, Button } from "vic-ui";
import { CodeSnippet, Slider, Toggle } from "vic-ui/ui";
import * as icons from "vic-ui/icons";
import registry from "../../../src/icons/registry.json";
import "../icons.css";

const collections = { all: "All collections", tabler: "Tabler", mingcute: "MingCute", iconmcp: "IconMCP", own: "vic originals" };
const label = (name: string) => name.replace(/Icon$/, "").replace(/([a-z])([A-Z])/g, "$1 $2");

export default function IconCatalogue() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("all");
  const [size, setSize] = useState(24);
  const [selected, setSelected] = useState(registry[0]!);
  const [message, setMessage] = useState("");
  const specimen = useRef<HTMLDivElement>(null);
  const matches = registry.filter(icon => (collection === "all" || icon.source.startsWith(`${collection}:`)) && `${icon.name} ${label(icon.name)} ${icon.source}`.toLowerCase().includes(query.trim().toLowerCase()));
  const Glyph = icons[selected.name as keyof typeof icons];
  const importLine = `import { ${selected.name} } from "vic-ui/icons";`;
  async function copy(text: string, success: string) {
    try { await navigator.clipboard.writeText(text); setMessage(success); }
    catch { setMessage("Copy failed. Select and copy the code below."); }
  }
  function copySVG() {
    const svg = specimen.current?.querySelector("svg")?.cloneNode(true) as SVGElement | undefined;
    if (!svg) return;
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", String(size)); svg.setAttribute("height", String(size));
    svg.removeAttribute("aria-hidden");
    void copy(svg.outerHTML, `Copied ${selected.name} SVG`);
  }
  return <div className="icon-workspace">
    <div className="icon-controls">
      <SearchField disabled={!ready} label="Find an icon" placeholder="Search arrows, files, people…" value={query} onValueChange={value => { setQuery(value); setMessage(""); }} />
      <Select label="Collection" items={collections} value={collection} onValueChange={value => { setCollection(value); setMessage(""); }} />
      <div className="icon-size"><label id="icon-size-label">Preview size <output>{size}px</output></label><Slider aria-labelledby="icon-size-label" min={16} max={40} step={4} value={size} onValueChange={value => setSize(Array.isArray(value) ? value[0]! : value)} /></div>
    </div>
    <div className="icon-results">
      <p className="icon-result-count" role="status">{message || `${matches.length} icons`}</p>
      <div className="icon-grid" aria-label="Icon catalogue">
        {matches.map(icon => {
          const Icon = icons[icon.name as keyof typeof icons];
          return <Toggle key={icon.name} className="icon-tile" disabled={!ready} pressed={selected.name === icon.name} aria-label={`Copy ${icon.name} import`}
            onPressedChange={() => { setSelected(icon); void copy(`import { ${icon.name} } from "vic-ui/icons";`, `Copied ${icon.name}`); }}>
            <Icon size={size} style={{ width: size, height: size }} /><span>{label(icon.name)}</span>
          </Toggle>;
        })}
      </div>
      {!matches.length && <div className="icon-empty"><h2>No icons found</h2><p>Try a shorter name or another collection.</p><Button look="line" onClick={() => { setQuery(""); setCollection("all"); }}>Clear filters</Button></div>}
    </div>
    <aside className="icon-inspector" aria-label="Selected icon">
      <div ref={specimen} className="icon-specimen"><Glyph size={80} /></div>
      <h2>{label(selected.name)}</h2><p className="icon-source">{selected.source}</p>
      <div className="icon-actions"><Button onClick={() => void copy(importLine, `Copied ${selected.name}`)}>Copy React</Button><Button look="line" onClick={copySVG}>Copy SVG</Button></div>
      <CodeSnippet code={`${importLine}\n\n<${selected.name} size={${size}} />`} filename="React" />
      <p className="icon-usage">Inherits text color. SVGs ship with the package. Give icon-only controls an accessible name.</p>
      <Link to="/docs/icons" className="underline underline-offset-4">Usage and source licenses</Link>
    </aside>
  </div>;
}
