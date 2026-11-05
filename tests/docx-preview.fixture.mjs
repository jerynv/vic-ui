import { createElement as h, useMemo, useState } from "react";
import { DocxPreview } from "../dist/preview-docx.js";

export function DocxFixture({ cases }) {
  const [selected, select] = useState("good"), [shown, show] = useState(true), [errors, count] = useState(0), [limit, setLimit] = useState(undefined);
  const inputs = useMemo(() => {
    const values = Object.fromEntries(Object.entries(cases).map(([name, bytes]) => [name, new Uint8Array(bytes)]));
    let reads = 0;
    class RetryBlob extends Blob { arrayBuffer() { if (++reads === 1) return Promise.reject(new Error("Temporary byte read failure")); return super.arrayBuffer(); } }
    class DeferredBlob extends Blob { arrayBuffer() { return new Promise(resolve => { window.resolveOldDocx = () => resolve(values.good.slice().buffer); }); } }
    values.retry = new RetryBlob([values.good]); values.stale = new DeferredBlob([values.good]);
    values.imageRace = new Blob([values.good]);
    values.oversized = new Blob([new Uint8Array(10 * 1024 * 1024 + 1)]);
    return values;
  }, [cases]);
  return h("main", null,
    h("nav", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, ...Object.keys(inputs).map(name => h("button", { key: name, onClick: () => { select(name); show(true); } }, name)),
      h("button", { onClick: () => show(false) }, "Unmount"),
      h("button", { onClick: () => setLimit(64) }, "Lower byte limit"), h("button", { onClick: () => setLimit(undefined) }, "Reset byte limit")),
    h("output", { id: "docx-errors" }, errors),
    h("input", { "aria-label": "Before document" }),
    h("section", { style: { width: "100%", maxWidth: 800 }, id: "docx-host" }, shown ? h(DocxPreview, { input: inputs[selected], title: "Report document", maxBytes: limit, onError: () => count(n => n + 1) }) : null));
}
