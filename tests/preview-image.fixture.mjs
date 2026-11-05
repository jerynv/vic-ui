import { createElement as h, useState } from "react";
import { ImagePreview } from "../dist/index.js";

export const landscape = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#dae9e7"/><path d="M0 400H1200M600 0V800" stroke="#12655c" stroke-width="4"/><text x="600" y="440" text-anchor="middle" font-size="36">Local image</text><script>window.imageScriptExecuted=true</script></svg>`;
const portrait = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="2400"><rect width="600" height="2400" fill="#e9e0cf"/><path d="M0 0L600 2400M600 0L0 2400" stroke="#665436" stroke-width="8"/></svg>`;
const encode = value => new TextEncoder().encode(value);
const sources = { landscape: encode(landscape), portrait: encode(portrait), invalid: encode("not an image") };
// A view into a larger buffer catches accidental conversion of the entire backing buffer.
const padded = encode(`prefix${landscape}suffix`);
sources.view = padded.subarray(6, padded.length - 6);
sources.oversized = new Uint8Array(20 * 1024 * 1024 + 1);
sources.oversizedBlob = new Blob([sources.oversized]);

export function PreviewImageFixture() {
  const [source, setSource] = useState("landscape");
  const [shown, setShown] = useState(true);
  const [errors, setErrors] = useState(0);
  const [lastError, setLastError] = useState("");
  const [maxBytes, setMaxBytes] = useState(undefined);
  return h("main", { style: { padding: 24 } },
    h("nav", { style: { display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 } },
      ...Object.keys(sources).map(name => h("button", { type: "button", key: name, onClick() { setSource(name); setShown(true); } }, name)),
      h("button", { type: "button", onClick() { setShown(value => !value); } }, "Toggle image"),
      h("input", { id: "outside-input", "aria-label": "Outside image" }),
      ...[["Small budget", sources.view.byteLength - 1], ["Exact view budget", sources.view.byteLength], ["Raised budget", 40 * 1024 * 1024], ["Invalid budget", NaN], ["Default budget", undefined]].map(([label, value]) =>
        h("button", { type: "button", key: label, onClick() { setMaxBytes(value); } }, label)),
    ),
    h("output", { id: "errors" }, errors),
    h("output", { id: "last-error", hidden: true }, lastError),
    h("section", { id: "image-host", style: { width: 600, maxWidth: "100%" } }, shown ? h(ImagePreview, {
      input: sources[source], alt: "Test picture", mimeType: "image/svg+xml", maxBytes, onError(error) { setErrors(value => value + 1); setLastError(error.message); },
    }) : null),
    h("div", { style: { height: 1000 } }, "Scroll space"),
  );
}
