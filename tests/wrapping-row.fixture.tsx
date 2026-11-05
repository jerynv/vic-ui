import { useState, type ComponentPropsWithRef, type ElementType } from "react";
import { createRoot } from "react-dom/client";
import { WrappingRow, type WrappingRowProps } from "../src/components/WrappingRow";
import { Button } from "../src/components/Button";
import { Badge } from "../src/components/Badge";
import "./wrapping-row.fixture.css";

declare global { interface Window { rowProof: { refs: Record<string, Element | null>; events: string[]; navigation: unknown } } }
window.rowProof = { refs: {}, events: [], navigation: null };
const params = new URLSearchParams(location.search);
document.documentElement.dataset.mode = params.get("theme") ?? "light";
function Legacy<T extends ElementType = "div">({ as, className, ...rest }: WrappingRowProps<T>) {
  const Component = as ?? "div";
  return <Component className={className ? `hit-row ${className}` : "hit-row"} {...rest} />;
}
const Row = params.has("reference") ? Legacy : WrappingRow;
const refFor = (name: string) => (el: Element | null) => { window.rowProof.refs[name] = el; };
function HostLink({ to, replace, state, ...rest }: Omit<ComponentPropsWithRef<"a">, "href"> & { to: string; replace?: boolean; state?: unknown }) {
  return <a {...rest} href={to} onClick={event => { event.preventDefault(); window.rowProof.navigation = { to, replace, state }; rest.onClick?.(event); }} />;
}
const Words = ({ title, detail = "A second line with details supplied by the host." }: { title: string; detail?: string }) =>
  <span className="fixture-words"><span className="block">{title}</span><span className="block fixture-subtle fixture-meta">{detail}</span></span>;

// Each record maps to one exact JSX site in the supplied source; only synthetic content is used.
const patterns = [
  { id: "billing-held", file: "admin/Billing.tsx:105", shape: "action" },
  { id: "bookings-pick", file: "admin/Bookings.tsx:259", shape: "button" },
  { id: "bookings-line", file: "admin/Bookings.tsx:365", shape: "action" },
  { id: "terms-loading", file: "admin/ChangeTerms.tsx:74", shape: "loading-li" },
  { id: "terms-preview", file: "admin/ChangeTerms.tsx:267", shape: "passive" },
  { id: "content-loading", file: "admin/Content.tsx:65", shape: "loading" },
  { id: "content-collapsed", file: "admin/Content.tsx:108", shape: "loading-bare" },
  { id: "content-area", file: "admin/Content.tsx:128", shape: "link" },
  { id: "content-list-loading", file: "admin/Content.tsx:184", shape: "numbered-loading" },
  { id: "content-request", file: "admin/Content.tsx:240", shape: "numbered-link" },
  { id: "content-channel", file: "admin/Content.tsx:397", shape: "link" },
  { id: "content-document", file: "admin/Content.tsx:475", shape: "download" },
  { id: "features-delivery", file: "admin/Features.tsx:359", shape: "start" },
  { id: "lead-loading", file: "admin/Lead.tsx:252", shape: "loading-li" },
  { id: "agreement", file: "admin/OrganizationBilling.tsx:279", shape: "named" },
  { id: "bones-list", file: "components/Bones.tsx:97", shape: "loading" },
  { id: "skeleton-hit", file: "components/Skeleton.tsx:96", shape: "glyph-loading" },
] as const;
function Patterns() {
  return <section className="console-frame" data-patterns><h2>Portable source patterns</h2>{patterns.map(item => {
    const loading = item.shape.includes("loading"), numbered = item.shape.includes("numbered");
    const words = loading ? <span className="fixture-words" aria-hidden="true"><span className="fixture-bone" /><span className="fixture-bone small" /></span> :
      <Words title={item.shape === "named" ? "Version 2: a deliberately long agreement heading" : item.id.replaceAll("-", " ")} detail="Synthetic supporting details that may take more than one line on a small screen." />;
    const contents = <>{numbered ? <span className="fixture-subtle">#42</span> : item.shape === "glyph-loading" ? <span className="fixture-glyph" aria-hidden="true"><span className="fixture-bone" /></span> : null}{words}{!loading && !item.shape.includes("link") && item.shape !== "button" ? <Badge>Waiting</Badge> : null}{item.shape === "action" ? <Button look="quiet" onClick={() => window.rowProof.events.push(item.id)}>Cancel</Button> : item.shape === "download" ? <a href="#download" onClick={e => e.preventDefault()}>Download</a> : null}</>;
    const attributes = { id: item.id, "data-pattern": item.file, className: item.shape === "start" ? "items-start" : item.shape === "named" ? "row-named flex-wrap items-center responsive-words" : item.shape === "action" || item.shape === "passive" || item.shape === "loading-li" ? "flex-wrap items-center" : "items-center" };
    if (item.shape.includes("link")) return <ul key={item.id}><li><Row as={HostLink} to={`#${item.id}`} {...attributes}>{contents}</Row></li></ul>;
    if (item.shape === "button") return <ul key={item.id}><li><Row as="button" type="button" {...attributes} className="w-full items-center text-left" onClick={() => window.rowProof.events.push(item.id)}>{contents}</Row></li></ul>;
    if (item.shape === "loading" || item.shape === "numbered-loading") return <ul key={item.id}><li><Row {...attributes}>{contents}</Row></li></ul>;
    if (item.shape === "loading-bare" || item.shape === "glyph-loading") return <Row key={item.id} {...attributes}>{contents}</Row>;
    return <ul key={item.id}><Row as="li" {...attributes}>{contents}</Row></ul>;
  })}</section>;
}
function App() {
  const [mounted, mount] = useState(true), [clicks, click] = useState(0);
  const activate = (name: string) => { window.rowProof.events.push(name); click(n => n + 1); };
  return <main><h1>Wrapping rows</h1><p>Native elements, several lines, and independent actions.</p>
    <section data-showcase><h2>Rows on the page</h2>
      <Row id="plain" ref={refFor("div")} title="Forwarded title" data-native="kept"><Words title="A plain row" /></Row>
      <Row id="empty" aria-label="Empty row" />
      <Row id="padded" className="py-small px-large items-center"><Words title="Vertical rhythm stays consistent" /></Row>
      <Row id="unlayered" className="unlayered-horizontal"><Words title="Horizontal padding stays with the caller" /></Row>
      <div className="hit-row" id="legacy-alias"><Words title="Existing hit-row alias" /></div>
      <Row id="busy" aria-busy="true"><span className="fixture-bone" aria-hidden="true" /><span className="sr-only">Loading row</span></Row>
    </section>
    <section className="console-frame" data-showcase><h2>The existing console context</h2>
      <ul id="panel-mixed">
        <li><Row as="a" href="#destination" id="anchor" ref={refFor("a")} onClick={e => { e.preventDefault(); activate("anchor"); }} className="items-center"><Words title="Open the detailed record" detail="A full-row link keeps its native destination." /></Row></li>
        <li><Row as="button" type="button" id="button" ref={refFor("button")} name="record" value="synthetic" className="w-full items-center text-left" onFocus={() => window.rowProof.events.push("focus")} onClick={() => activate("button")}><Words title="Choose this record" /></Row></li>
        <Row as="li" id="passive" ref={refFor("li")} className="flex-wrap items-center responsive-words"><Words title="A record with independent actions" detail="These controls stay separate; pressing the words does nothing." /><a id="download" href="#download" onClick={e => { e.preventDefault(); activate("download"); }}>Download</a><Button id="cancel" look="quiet" onClick={() => activate("cancel")}>Cancel</Button></Row>
        <li><Row as="button" type="button" id="disabled" disabled className="w-full text-left" onClick={() => activate("disabled")}><Words title="Unavailable record" /></Row></li>
      </ul>
      <ul id="panel-direct"><Row as="li" className="items-center"><Words title="Direct list rows are discovered too" /></Row><Row as="li"><Words title="They share the same hairline" /></Row></ul>
      <ul id="plain-list"><li>Lists without rows are unaffected.</li></ul>
    </section>
    <section><h2>Host-owned behavior</h2>
      <Row as={HostLink} to="#host-link" replace state={{ from: "fixture" }} id="host-link" ref={refFor("link")} onClick={() => activate("link")}><Words title="Injected host Link" /></Row>
      <form onSubmit={e => { e.preventDefault(); activate("submit"); }}><Row as="button" id="native-submit" name="native" value="yes">Native default button type</Row></form>
      {mounted ? <Row as="button" type="button" id="removable" ref={refFor("removed")}>Removable ref</Row> : null}
      <Button id="remove" look="quiet" onClick={() => mount(false)}>Unmount the row</Button><output aria-label="Actions">{clicks}</output>
    </section>
    <Patterns />
  </main>;
}
createRoot(document.getElementById("root")!).render(<App />);
