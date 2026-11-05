import { useMemo } from "react";
import { FilePreviewStatus } from "./FilePreview";
import { previewLimit, previewLines, usePreviewText, type PreviewTextInput } from "./preview-input";

export interface TextPreviewProps {
  input: PreviewTextInput;
  name?: string;
  /** May lower the 512 KiB decoding budget. */
  maxBytes?: number;
  /** May lower the 20,000 displayed-line budget. */
  maxLines?: number;
  className?: string;
  onError?: (error: Error) => void;
}

/** Plain UTF-8 source with line numbers. Uploaded HTML is text, never executable markup. */
export function TextPreview({ input, name = "Text file", maxBytes, maxLines, className, onError }: TextPreviewProps) {
  const bytes = previewLimit(maxBytes, 512 * 1024), limit = previewLimit(maxLines, 20_000);
  const { state, retry } = usePreviewText(input, bytes, onError);
  const text = state.status === "ready" ? state.text : null;
  const lines = useMemo(() => text === null ? null : previewLines(text, limit), [text, limit]);
  if (state.status === "error") return <FilePreviewStatus status="error" title="Text could not be read" message="Try again, or download the file to read it in another application." onRetry={retry} />;
  if (state.status !== "ready" || !lines) return <FilePreviewStatus status="loading" title="Loading text" />;
  return <div className={["ui-preview-text", className].filter(Boolean).join(" ")} role="region" aria-label={name} tabIndex={0}>
    <pre className="ui-preview-text-code">{lines.lines.map((line, index) => <span key={index} className="ui-preview-text-line">{line}{"\n"}</span>)}</pre>
    {state.truncated || lines.truncated ? <p className="ui-preview-text-notice" role="status">
      Preview limited to {lines.truncated ? `${limit.toLocaleString("en-US")} lines` : `${bytes.toLocaleString("en-US")} bytes`}. Download the file to read the rest.
    </p> : null}
  </div>;
}
