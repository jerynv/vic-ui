import { useEffect, useRef, useState } from "react";
import { FilePreviewStatus } from "../../components/preview/FilePreview";
import { previewLimit } from "../../components/preview/preview-input";
import { DOCX_LIMITS, docxFrame, docxMarkup, inertDocxFactory, prepareDocx } from "./docx-safety";

export interface DocxPreviewProps {
  input: Blob | Uint8Array<ArrayBuffer>;
  title: string;
  className?: string;
  maxBytes?: number;
  onError?: (error: Error) => void;
}
type State = { input: DocxPreviewProps["input"]; limit: number; attempt: number } & (
  | { status: "ready"; head: string; body: string; width: number }
  | { status: "error"; error: Error }
);

/** Adapted from V-Client's real DocxView; see THIRD_PARTY_NOTICES.md for the authorized source pin. */
export function DocxPreview({ input, title, className, maxBytes, onError }: DocxPreviewProps) {
  const limit = previewLimit(maxBytes, DOCX_LIMITS.maxBytes);
  const [attempt, setAttempt] = useState(0), [state, setState] = useState<State | null>(null);
  const [width, setWidth] = useState(0);
  const host = useRef<HTMLDivElement>(null), report = useRef(onError);
  report.current = onError;
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const measure = () => setWidth(element.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") { window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); }
    const observer = new ResizeObserver(measure); observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const abort = new AbortController();
    let body: HTMLElement | undefined, styles: HTMLElement | undefined;
    void (async () => {
      const bytes = await prepareDocx(input, limit, abort.signal);
      if (abort.signal.aborted) return;
      const { renderAsync } = await import("docx-preview");
      if (abort.signal.aborted) return;
      const inert = document.implementation.createHTMLDocument("");
      body = inert.createElement("div"); styles = inert.createElement("div");
      const factory = inertDocxFactory(inert, abort.signal);
      await renderAsync(bytes, body, styles, {
        inWrapper: true, useBase64URL: true, ignoreFonts: true, renderAltChunks: false,
        renderComments: false, renderChanges: false, experimental: false,
        h: factory,
      });
      if (abort.signal.aborted) return;
      factory.verify();
      setState({ input, limit, attempt, status: "ready", ...docxMarkup(body, styles) });
    })().catch(cause => {
      if (abort.signal.aborted) return;
      const error = cause instanceof Error ? cause : new Error("The DOCX could not be rendered.");
      setState({ input, limit, attempt, status: "error", error }); report.current?.(error);
    }).finally(() => { body?.replaceChildren(); styles?.replaceChildren(); });
    return () => { abort.abort(); body?.replaceChildren(); styles?.replaceChildren(); };
  }, [input, limit, attempt]);
  const current = state?.input === input && state.limit === limit && state.attempt === attempt ? state : null;
  const zoom = current?.status === "ready" && width > 0 ? Math.min(1, Math.max(0.1, (width - 16) / (current.width + 32))) : 0;
  return <div ref={host} tabIndex={-1} role="group" aria-label={`Document preview: ${title}`} className={["ui-preview-docx", className].filter(Boolean).join(" ")}>
    {current?.status === "error" ? <FilePreviewStatus status="error" title="Document preview unavailable" message={current.error.message} onRetry={() => { host.current?.focus({ preventScroll: true }); setAttempt(value => value + 1); }} />
      : current?.status === "ready" && zoom > 0 ? <iframe key={`${attempt}-${zoom}`} className="ui-preview-docx-frame" title={title} sandbox="" referrerPolicy="no-referrer" srcDoc={docxFrame(current.head, current.body, zoom)} />
        : <FilePreviewStatus status="loading" title="Preparing document" />}
  </div>;
}
