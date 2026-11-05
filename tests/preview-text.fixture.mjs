import { createElement as h, useMemo, useState } from "react";
import { Button, DelimitedPreview, TextPreview } from "../dist/index.js";

const encoded = text => new TextEncoder().encode(text);
const source = encoded('<script>window.__previewExecuted = true</script>\r\nsecond\rthird\n');
const csv = encoded('\ufeffName,Notes,Formula\r\nAda,"a comma, and a\nnew line",=SUM(A1:A2)\r\nBo,"a ""quote""",<img src=x onerror="window.__previewExecuted=true">');
const wide = encoded(Array.from({ length: 80 }, (_, row) => Array.from({ length: 12 }, (_, column) => `${row}-${column} extra column content`).join(',')).join('\n'));

class DeferredBlob extends Blob {
  release;
  slice(start, end) {
    const part = super.slice(start, end);
    return { arrayBuffer: () => new Promise((resolve, reject) => { this.release = error => error ? reject(error) : part.arrayBuffer().then(resolve); }) };
  }
}
class RetryBlob extends Blob {
  calls = 0;
  slice(start, end) {
    const part = super.slice(start, end);
    return { arrayBuffer: () => ++this.calls === 1 ? Promise.reject(new Error("fixture unread")) : part.arrayBuffer() };
  }
}

export function PreviewTextFixture() {
  const slow = useMemo(() => new DeferredBlob(["STALE FILE"]), []);
  const abandoned = useMemo(() => new DeferredBlob(["ABANDONED FILE"]), []);
  const retry = useMemo(() => new RetryBlob(["Retry succeeds"]), []);
  const fresh = useMemo(() => encoded("CURRENT FILE"), []);
  const [current, setCurrent] = useState(slow);
  const [errors, setErrors] = useState(0);
  const [visible, setVisible] = useState(true);
  return h("main", { style: { maxWidth: 720, padding: 16 } },
    h("section", { id: "text" }, h(TextPreview, { input: source, name: "Source text" })),
    h("section", { id: "limited-text" }, h(TextPreview, { input: source, maxLines: 2 })),
    h("section", { id: "utf8" }, h(TextPreview, { input: encoded("A€B"), maxBytes: 3 })),
    h("section", { id: "csv" }, h(DelimitedPreview, { input: csv, name: "Quoted values" })),
    h("section", { id: "empty-cell" }, h(DelimitedPreview, { input: encoded('""') })),
    h("section", { id: "limits" }, h(DelimitedPreview, { input: encoded("a,b,c\n1,2,3\n4,5,6"), maxRows: 2, maxColumns: 2 })),
    h("section", { id: "partial" }, h(DelimitedPreview, { input: encoded("a,b\n1,2\ncut,row"), maxBytes: 10 })),
    h("section", { id: "wide" }, h(DelimitedPreview, { input: wide, name: "Wide values" })),
    h("section", { id: "stale" }, visible ? h(TextPreview, { input: current, onError: () => setErrors(n => n + 1) }) : null,
      h(Button, { id: "replace", onClick: () => setCurrent(fresh) }, "Replace file"),
      h(Button, { id: "resolve-old", onClick: () => slow.release?.() }, "Resolve old file"),
      h(Button, { id: "unmount", onClick: () => setVisible(false) }, "Remove preview")),
    visible ? h("section", { id: "abandoned" }, h(TextPreview, { input: abandoned, onError: () => setErrors(n => n + 1) })) : null,
    h(Button, { id: "reject-abandoned", onClick: () => abandoned.release?.(new Error("abandoned read")) }, "Reject removed file"),
    h("section", { id: "retry" }, h(TextPreview, { input: retry, onError: () => setErrors(n => n + 1) })),
    h("output", { id: "errors" }, errors),
  );
}
