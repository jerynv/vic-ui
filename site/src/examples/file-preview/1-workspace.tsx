import { useId, useMemo, useRef, useState } from "react";
import { ButtonLink, DelimitedPreview, FilePreviewDialog, FilePreviewStage, IconButton, ImagePreview, Tabs, TextPreview } from "vic-ui";
import { DownloadSimpleIcon, MaximizeIcon } from "vic-ui/icons";

export const title = "A file, in context or full screen";
export const note = "Open the image, notes or CSV. Zoom and drag the image, inspect the data, download the local sample or open all three in the full-screen viewer.";

const drawing = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="620" viewBox="0 0 960 620">
  <rect width="960" height="620" fill="#f6f4ed"/>
  <g fill="#252723" font-family="sans-serif"><text x="64" y="84" font-size="34">Corner study</text><text x="64" y="118" font-size="16">Synthetic sample / 960 x 620 px</text></g>
  <g fill="none" stroke="#252723" stroke-width="2"><rect x="64" y="174" width="380" height="330" rx="64"/><rect x="82" y="192" width="344" height="294" rx="46"/><path d="M64 538h380M64 528v20m380-20v20"/></g>
  <rect x="524" y="174" width="372" height="152" rx="76" fill="#c4d0bc"/><rect x="542" y="192" width="336" height="116" rx="58" fill="#252723"/>
  <g fill="#252723" font-family="sans-serif" font-size="18"><text x="524" y="376">Outer radius: 76 px</text><text x="524" y="408">Inset: 18 px</text><text x="524" y="440">Inner radius: 58 px</text><text x="64" y="580" font-size="16">Concentric corners keep a consistent rim.</text></g>
</svg>`;
const notes = `CORNER STUDY

Three local files, one preview surface.

Image
The SVG contains only geometry and text. Zoom in to inspect the
corners, drag to move around, or choose Fit image to return.

Text
This file is rendered as plain text with line numbers. Markup such
as <button>Open</button> stays text; it never becomes a control.

Data
The CSV includes a quoted comma and a multiline cell. Download
preserves the original file rather than exporting the preview.
`;
const csv = `Component,Outer radius,Inset,Inner radius,Notes
Panel,64,18,46,"Concentric corners, uniform inset"
Pill,76,18,58,"Rounded ends"
Button,12,2,10,"Two layers\nOne consistent rim"
`;

export default function Example() {
  const files = useMemo(() => [
    { id: "image-v1", label: "Image", name: "corner-study.svg", mime: "image/svg+xml", source: drawing },
    { id: "text-v1", label: "Text", name: "readme.txt", mime: "text/plain", source: notes },
    { id: "csv-v1", label: "CSV", name: "dimensions.csv", mime: "text/csv", source: csv },
  ].map(file => ({ ...file, input: new Blob([file.source], { type: file.mime }),
    download: `data:${file.mime};charset=utf-8,${encodeURIComponent(file.source)}` })), []);
  const [selected, setSelected] = useState(files[0]!.id);
  const [activeId, setActiveId] = useState<string | null>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const prefix = useId();
  const file = files.find(item => item.id === selected)!;
  const preview = (item: typeof file) => item.mime === "image/svg+xml"
    ? <ImagePreview input={item.input} alt="Geometric corner study comparing a rectangular panel and a pill with concentric inner edges" />
    : item.mime === "text/csv" ? <DelimitedPreview input={item.input} name={item.name} />
      : <TextPreview input={item.input} name={item.name} />;
  const download = (item: typeof file) => <ButtonLink look="line" href={item.download} download={item.name} icon={<DownloadSimpleIcon size={16} />}>Download</ButtonLink>;
  return <div className="demo-wide">
    <Tabs items={files.map(item => ({ value: item.id, label: item.label }))} value={selected}
      onValueChange={setSelected} idPrefix={prefix} aria-label="Sample files" />
    <div role="tabpanel" id={`${prefix}-${selected}-panel`} aria-labelledby={`${prefix}-${selected}`}>
      <FilePreviewStage file={{ id: file.id, name: file.name, size: file.input.size, description: "Local sample" }}
        actions={<>{download(file)}<IconButton ref={opener} label="Open full screen" icon={<MaximizeIcon size={18} />} onClick={() => setActiveId(selected)} /></>}>
        <div key={file.id}>{preview(file)}</div>
      </FilePreviewStage>
    </div>
    <FilePreviewDialog items={files.map(item => ({ id: item.id, label: item.name, content: preview(item) }))}
      activeId={activeId} onActiveIdChange={id => { setActiveId(id); if (id) setSelected(id); }} returnFocusRef={opener}
      renderActions={item => download(files.find(file => file.id === item.id)!)} />
  </div>;
}
