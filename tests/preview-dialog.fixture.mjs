import { createElement as h, useRef, useState } from "react";
import { Button, ButtonLink, FilePreviewStage, FilePreviewToolbar, FilePreviewStatus, FilePreviewDialog, DelimitedPreview, Dialog } from "../dist/index.js";

const table = new TextEncoder().encode("A long column heading,Another long column heading,One more long column heading\nFirst,Second,Third");

export function PreviewDialogFixture() {
  const [activeId, setActiveId] = useState(null), [removed, setRemoved] = useState(false), [mounted, setMounted] = useState(true);
  const [retry, setRetry] = useState(false), [filter, setFilter] = useState("find me");
  const returnRef = useRef(null);
  const [nested, setNested] = useState(false);
  const items = [
    { id: "first", label: "First file", content: h("div", null,
      h("input", { "aria-label": "Filter preview", value: filter, onChange: e => setFilter(e.target.value), onKeyDown: e => { if (e.key === "Escape" && filter) { e.preventDefault(); setFilter(""); } } }),
      h("div", { contentEditable: true, suppressContentEditableWarning: true, role: "textbox", "aria-label": "Editable annotation" }, "Annotation"),
      h("div", { style: { width: 220 } }, h(DelimitedPreview, { input: table, name: "Wide data" })),
      h(Button, { onClick: () => setNested(true) }, "Open nested dialog"),
      h(Dialog, { open: nested, onOpenChange: setNested, title: "Nested choices" }, h(Button, { onClick: () => setNested(false) }, "Done")),
      h(Button, { onClick: () => setActiveId("second") }, "Replace active file"),
      h(Button, { onClick: () => setRemoved(true) }, "Remove active item"), h(Button, { onClick: () => setMounted(false) }, "Unmount preview")) },
    { id: "second", label: "Second file", content: h("p", null, "Second file content") },
  ].filter(item => !removed || item.id !== "first");
  return h("main", { style: { padding: 24 } },
    h(Button, { id: "launch", onClick: () => { setRemoved(false); setMounted(true); setActiveId("first"); } }, "Open preview"),
    h(Button, { onClick: () => setActiveId("missing") }, "Open missing item"),
    h("input", { ref: returnRef, "aria-label": "Return focus target" }),
    h("output", { id: "active" }, activeId ?? "closed"),
    h(FilePreviewStage, { file: { id: "sample", name: "Example.csv", size: 1024, description: "Comma-separated values" },
      tools: h(FilePreviewToolbar, { label: "Custom tools" }, h(Button, { look: "line" }, "Select columns")),
      actions: h(ButtonLink, { href: "data:text/plain,example", download: "example.txt" }, "Download sample") },
      retry ? h("p", null, "Retry completed") : h(FilePreviewStatus, { status: "error", message: "Could not decode the sample.", onRetry: () => setRetry(true) })),
    h(FilePreviewStatus, { status: "loading" }), h(FilePreviewStatus, { status: "unsupported", message: "Download this file to open it." }),
    mounted ? h(FilePreviewDialog, { items, activeId, onActiveIdChange: setActiveId,
      returnFocusRef: typeof window !== "undefined" && location.search.includes("explicit") ? returnRef : undefined,
      renderActions: () => h(ButtonLink, { href: "data:text/plain,example", download: "example.txt" }, "Download file") }) : null);
}
