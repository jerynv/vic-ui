import { useMemo } from "react";
import { FilePreviewStatus } from "./FilePreview";
import { parseDelimited } from "./delimited";
import { previewLimit, usePreviewText, type PreviewTextInput } from "./preview-input";

export interface DelimitedPreviewProps {
  input: PreviewTextInput;
  name?: string;
  delimiter?: "," | "\t";
  /** May lower the 1 MiB decoding budget. */
  maxBytes?: number;
  /** Includes the header; may lower the 1,000-row budget. */
  maxRows?: number;
  /** May lower the 60-column budget. */
  maxColumns?: number;
  className?: string;
  onError?: (error: Error) => void;
}

/** Quoted CSV/TSV cells rendered as text. Formula-looking strings are not evaluated. */
export function DelimitedPreview({ input, name = "Delimited file", delimiter = ",", maxBytes, maxRows, maxColumns, className, onError }: DelimitedPreviewProps) {
  const bytes = previewLimit(maxBytes, 1024 * 1024), rows = previewLimit(maxRows, 1000), columns = previewLimit(maxColumns, 60);
  const { state, retry } = usePreviewText(input, bytes, onError);
  const text = state.status === "ready" ? state.text : null, partial = state.status === "ready" && state.truncated;
  const grid = useMemo(() => text === null ? null : parseDelimited(text, delimiter, rows, columns, partial), [text, delimiter, rows, columns, partial]);
  if (state.status === "error") return <FilePreviewStatus status="error" title="Table could not be read" message="Try again, or download the file to open it in another application." onRetry={retry} />;
  if (state.status !== "ready" || !grid) return <FilePreviewStatus status="loading" title="Loading table" />;
  const [head, ...body] = grid.rows;
  const cells = (row: string[]) => Array.from({ length: grid.columns }, (_, index) => row[index] ?? "");
  return <div className={["ui-preview-table-scroll", className].filter(Boolean).join(" ")} role="region" aria-label={name} tabIndex={0}>
    {head ? <table className="ui-preview-table" aria-label={name}>
      <thead><tr><th className="ui-preview-table-number" scope="col" aria-label="Row" />{cells(head).map((cell, index) => <th key={index} scope="col">{cell}</th>)}</tr></thead>
      <tbody>{body.map((row, rowIndex) => <tr key={rowIndex}>
        <th className="ui-preview-table-number" scope="row">{rowIndex + 2}</th>
        {cells(row).map((cell, index) => <td key={index}>{cell}</td>)}
      </tr>)}</tbody>
    </table> : <p className="ui-preview-text-notice">{partial ? "No complete rows within the preview limit." : "This file is empty."}</p>}
    {partial || grid.truncatedRows || grid.truncatedColumns ? <p className="ui-preview-text-notice" role="status">
      Preview limited to {[
        partial ? `${bytes.toLocaleString("en-US")} bytes (complete rows only)` : "",
        grid.truncatedRows ? `${rows.toLocaleString("en-US")} rows including the header` : "",
        grid.truncatedColumns ? `${columns} columns` : "",
      ].filter(Boolean).join(", ")}. Download the file to see the rest.
    </p> : null}
  </div>;
}
