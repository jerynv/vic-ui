import { Suspense, lazy } from "react";
import { FilePreviewStage, FilePreviewStatus } from "vic-ui";
import { AudioPreview, VideoPreview } from "vic-ui/preview/media";
import { XlsxPreview, PptxPreview } from "vic-ui/preview/office";
import { audioSample, documentSample, slidesSample, videoSample, workbookSample } from "./office-samples";

const DocxPreview = lazy(() => import("vic-ui/preview/docx").then(module => ({ default: module.DocxPreview })));
export const title = "Optional Office and media previews";
export const note = "Synthetic ready files. Workbooks show stored cells; slides show extracted text. Word conversion loads on demand. Native media uses your browser's codec support.";
export default function Example() {
  return <div className="demo-wide demo-stack">
    <FilePreviewStage file={{ id: "workbook", name: "Summary.xlsx" }}>
      <XlsxPreview input={workbookSample} title="Example workbook" />
    </FilePreviewStage>
    <FilePreviewStage file={{ id: "slides", name: "Quarterly review.pptx" }}>
      <PptxPreview input={slidesSample} title="Example slides" />
    </FilePreviewStage>
    <FilePreviewStage file={{ id: "document", name: "Project update.docx" }}>
      <Suspense fallback={<FilePreviewStatus status="loading" title="Loading Word preview" />}>
        <DocxPreview input={documentSample} title="Example Word document" />
      </Suspense>
    </FilePreviewStage>
    <FilePreviewStage file={{ id: "audio", name: "Short tone.wav" }}>
      <AudioPreview input={audioSample} mimeType="audio/wav" title="Quiet half-second example tone" />
    </FilePreviewStage>
    <FilePreviewStage file={{ id: "video", name: "Local clip.webm" }}>
      <VideoPreview input={videoSample} mimeType="video/webm" title="Synthetic local video clip" />
    </FilePreviewStage>
  </div>;
}
