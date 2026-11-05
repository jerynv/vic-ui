import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "../Button";
import { Spinner } from "../Spinner";

/** Portable metadata. The host owns classification, access checks and loading. */
export interface FilePreviewFile {
  id: string;
  name: string;
  size?: number;
  description?: string;
}

/** Adapted from V-Client FileStage; see THIRD_PARTY_NOTICES.md for provenance. */
export function FilePreviewStage({ file, tools, actions, children, className, ...props }: Omit<HTMLAttributes<HTMLElement>, "title"> & {
  file: FilePreviewFile;
  tools?: ReactNode;
  actions?: ReactNode;
}) {
  const size = file.size === undefined || !Number.isFinite(file.size) || file.size < 0 ? null
    : file.size < 1024 ? `${file.size} B` : file.size < 1024 ** 2 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / 1024 ** 2).toFixed(1)} MB`;
  return <section aria-label={file.name} {...props} className={["ui-preview-stage", className].filter(Boolean).join(" ")}>
    <header className="ui-preview-header">
      <div className="ui-preview-heading"><p className="ui-preview-name">{file.name}</p>
        {file.description || size ? <p className="ui-preview-description">{[file.description, size].filter(Boolean).join(" · ")}</p> : null}
      </div>
      {tools ? <FilePreviewToolbar>{tools}</FilePreviewToolbar> : null}
      {actions ? <div className="ui-preview-actions">{actions}</div> : null}
    </header>
    <div className="ui-preview-body">{children}</div>
  </section>;
}

/** A wrapping group of existing Vic controls; it never creates download URLs. */
export function FilePreviewToolbar({ label = "Preview controls", children, className }: { label?: string; children: ReactNode; className?: string }) {
  return <div role="group" aria-label={label} className={["ui-preview-toolbar", className].filter(Boolean).join(" ")}>{children}</div>;
}

/** Loading, conversion failure and unsupported content share a reserved stage. */
export function FilePreviewStatus({ status, title, message, onRetry, actions }: {
  status: "loading" | "error" | "unsupported";
  title?: string;
  message?: string;
  onRetry?: () => void;
  actions?: ReactNode;
}) {
  const heading = title ?? (status === "loading" ? "Loading preview" : status === "error" ? "Preview unavailable" : "No preview for this file");
  return <div className="ui-preview-status" aria-busy={status === "loading" || undefined}>
    <div role={status === "error" ? "alert" : "status"}>
      {status === "loading" ? <Spinner size={24} /> : null}
      <p className="ui-preview-status-title">{heading}</p>
      {message ? <p className="ui-preview-description">{message}</p> : null}
    </div>
    {onRetry || actions ? <div className="ui-preview-status-actions">
      {onRetry ? <Button look="line" onClick={onRetry}>Try again</Button> : null}{actions}
    </div> : null}
  </div>;
}
