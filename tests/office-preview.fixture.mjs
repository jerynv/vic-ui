import { createElement as h, useState } from "react";
import { XlsxPreview, PptxPreview } from "../dist/preview-office.js";
import { Button } from "../dist/index.js";
const bytes = source => Uint8Array.from(source);
export function OfficePreviewFixture({ files }) {
  const [ready] = useState(() => {
    class RetryBlob extends Blob { attempts = 0; arrayBuffer() { if (++this.attempts === 1) return Promise.reject(new Error("Synthetic read failure")); return super.arrayBuffer(); } }
    class SlowBlob extends Blob { arrayBuffer() { return new Promise(resolve => { window.__resolveOldOffice = () => super.arrayBuffer().then(resolve); }); } }
    class LateBlob extends Blob { arrayBuffer() { return new Promise((_, reject) => { window.__rejectLateOffice = () => reject(new Error("Late failure")); }); } }
    return { book: bytes(files.book), slides: bytes(files.slides), changed: bytes(files.changed), retry: new RetryBlob([bytes(files.book)]), retrySlides: new RetryBlob([bytes(files.slides)]), old: new SlowBlob([bytes(files.book)]), late: new LateBlob([bytes(files.book)]) };
  });
  const [main, setMain] = useState(ready.book), [stale, setStale] = useState(ready.old), [mounted, setMounted] = useState(true), [errors, setErrors] = useState(0);
  return h("main", null,
    h("div", { id: "workbook" }, h(XlsxPreview, { input: main, title: "Budget workbook" })),
    h("div", { id: "slides" }, h(PptxPreview, { input: ready.slides, title: "Quarterly slides" })),
    h("div", { id: "limited-book" }, h(XlsxPreview, { input: ready.book, title: "Limited workbook", maxRows: 1, maxColumns: 2, maxSheets: 1 })),
    h("div", { id: "limited-slides" }, h(PptxPreview, { input: ready.slides, title: "Limited slides", maxSlides: 1 })),
    h("div", { id: "retry" }, h(XlsxPreview, { input: ready.retry, title: "Retry workbook", onError: () => setErrors(n => n + 1) })),
    h("div", { id: "retry-slides" }, h(PptxPreview, { input: ready.retrySlides, title: "Retry slides" })),
    h("div", { id: "stale" }, h(XlsxPreview, { input: stale, title: "Changing workbook" })),
    h("div", { id: "late" }, mounted ? h(PptxPreview, { input: ready.late, title: "Late slides", onError: () => setErrors(n => n + 1) }) : null),
    h(Button, { id: "replace", onClick: () => { setMain(ready.changed); setStale(ready.changed); } }, "Replace workbook"),
    h(Button, { id: "unmount", onClick: () => setMounted(false) }, "Unmount pending preview"),
    h("output", { id: "errors" }, errors));
}
