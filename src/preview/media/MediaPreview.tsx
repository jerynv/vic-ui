import { useEffect, useRef, useState } from "react";
import { FilePreviewStatus } from "../../components/preview/FilePreview";
import { previewLimit } from "../../components/preview/preview-input";

// Adapted from V-Client MediaView at 2f2713d8; see THIRD_PARTY_NOTICES.md.
const MAX_BYTES = 64 * 1024 * 1024;
type MediaKind = "audio" | "video";
type Input = Blob | Uint8Array<ArrayBuffer>;

export interface MediaPreviewProps {
  /** Ready bytes only. The host owns fetching, authorization and classification. */
  input: Input;
  title: string;
  /** Overrides Blob.type; omitted byte-array types are sniffed by the native player. */
  mimeType?: string;
  /** May lower, never raise, the 64 MiB encoded input limit. */
  maxBytes?: number;
  className?: string;
  onError?: ((error: Error) => void) | undefined;
}
export type AudioPreviewProps = MediaPreviewProps;
export type VideoPreviewProps = MediaPreviewProps;
type Identity = { input: Input; mimeType: string; limit: number; attempt: number; kind: MediaKind };
type Resource = Identity & { url?: string; error?: Error; blocked?: boolean; disposed: boolean; element?: HTMLMediaElement };
const same = (a: Identity, b: Identity) => a.input === b.input && a.mimeType === b.mimeType && a.limit === b.limit && a.attempt === b.attempt && a.kind === b.kind;

function stop(media: HTMLMediaElement | undefined) {
  if (!media) return;
  media.pause();
  media.removeAttribute("src");
  // Reset the decoder and detach the old source before releasing its URL.
  media.load();
}

/** Native browser audio controls. Codec support remains the browser's responsibility. */
export function AudioPreview(props: AudioPreviewProps) { return <MediaPreview {...props} kind="audio" />; }
/** Native browser video controls, including seeking and fullscreen where supported. */
export function VideoPreview(props: VideoPreviewProps) { return <MediaPreview {...props} kind="video" />; }

function MediaPreview({ input, title, mimeType, maxBytes, className, onError, kind }: MediaPreviewProps & { kind: MediaKind }) {
  const limit = previewLimit(maxBytes, MAX_BYTES);
  const type = (mimeType ?? (input instanceof Uint8Array ? "" : input.type)).trim().toLowerCase();
  const [attempt, setAttempt] = useState(0);
  const [resource, setResource] = useState<Resource | null>(null);
  const identity = { input, mimeType: type, limit, attempt, kind };
  const latest = useRef(identity);
  latest.current = identity;
  const report = useRef(onError);
  report.current = onError;
  const container = useRef<HTMLDivElement>(null);
  const focusAfterRetry = useRef(false);
  const isCurrent = (value: Resource) => !value.disposed && same(value, latest.current);

  useEffect(() => {
    const next: Resource = { input, mimeType: type, limit, attempt, kind, disposed: false };
    try {
      const size = input instanceof Uint8Array ? input.byteLength : input.size;
      if (size === 0) {
        next.blocked = true;
        throw new Error("The media file is empty.");
      }
      if (size > limit) {
        next.blocked = true;
        throw new RangeError(`Media preview is limited to ${limit.toLocaleString("en-US")} encoded bytes. Use a smaller file or download the original.`);
      }
      if (type && !new RegExp(`^${kind}/[a-z0-9][a-z0-9.+-]*(?:\\s*;[^\\r\\n]*)?$`).test(type)) {
        next.blocked = true;
        throw new Error(`This ${kind} preview requires an ${kind === "audio" ? "audio" : "video"} media type.`);
      }
      // Size is checked before copying an array or allocating an object URL. Blob slicing
      // changes the MIME without reading/copying the full input into JavaScript memory.
      const blob = input instanceof Uint8Array
        ? new Blob([new Uint8Array(input).buffer], { type })
        : input.type === type ? input : input.slice(0, input.size, type);
      next.url = URL.createObjectURL(blob);
    } catch (cause) {
      next.error = cause instanceof Error ? cause : new Error("This browser could not open the media file.");
      report.current?.(next.error);
    }
    setResource(next);
    return () => {
      next.disposed = true;
      stop(next.element);
      if (next.url) URL.revokeObjectURL(next.url);
    };
  }, [input, type, limit, attempt, kind]);

  const current = resource && same(resource, identity) ? resource : null;
  const retry = () => {
    const box = container.current;
    focusAfterRetry.current = Boolean(box && box.contains(box.ownerDocument.activeElement));
    if (focusAfterRetry.current) box?.focus({ preventScroll: true });
    setAttempt(value => value + 1);
  };
  return <div ref={container} tabIndex={-1} className={["ui-preview-media", `ui-preview-${kind}`, className].filter(Boolean).join(" ")}>
    {current?.error ? <FilePreviewStatus status={current.blocked ? "unsupported" : "error"} title={`${kind === "audio" ? "Audio" : "Video"} preview unavailable`} message={current.error.message} {...(current.blocked ? {} : { onRetry: retry })} />
      : current?.url ? <Player key={current.url} resource={current} title={title} isCurrent={isCurrent} onRetry={retry}
        report={error => report.current?.(error)} onReady={media => {
          if (focusAfterRetry.current && container.current === media.ownerDocument.activeElement) media.focus({ preventScroll: true });
          focusAfterRetry.current = false;
        }} />
        : <FilePreviewStatus status="loading" title={`Loading ${kind}`} />}
  </div>;
}

function Player({ resource, title, isCurrent, onRetry, report, onReady }: {
  resource: Resource; title: string; isCurrent: (resource: Resource) => boolean;
  onRetry: () => void; report: (error: Error) => void; onReady: (media: HTMLMediaElement) => void;
}) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const failed = useRef(false);
  const Kind = resource.kind;
  if (state === "error") return <FilePreviewStatus status="error" title={`${Kind === "audio" ? "Audio" : "Video"} could not be played`}
    message="The file may be damaged, or this browser may not support its codec. Try again or download the original." onRetry={onRetry} />;
  return <div className="ui-preview-media-player" data-loading={state === "loading" ? "" : undefined} aria-busy={state === "loading" || undefined}>
    {state === "loading" ? <FilePreviewStatus status="loading" title={`Loading ${Kind}`} /> : null}
    <Kind ref={node => { if (node) resource.element = node; }} className={`ui-preview-${Kind}-element`} src={resource.url}
      controls preload="metadata" {...(Kind === "video" ? { playsInline: true } : {})} tabIndex={0} aria-label={title}
      onLoadedMetadata={event => {
        if (!isCurrent(resource) || failed.current) return;
        setState("ready"); onReady(event.currentTarget);
      }}
      onError={() => {
        if (!isCurrent(resource) || failed.current) return;
        failed.current = true;
        stop(resource.element);
        setState("error");
        report(new Error(`The browser could not decode this ${Kind} file.`));
      }} />
  </div>;
}
