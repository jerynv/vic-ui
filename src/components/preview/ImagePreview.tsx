import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ZoomFitIcon, ZoomInIcon, ZoomOutIcon } from "../../icons/icons";
import { IconButton } from "../IconButton";
import { FilePreviewStatus, FilePreviewToolbar } from "./FilePreview";
import { previewLimit } from "./preview-input";

// Adapted from V-Client ImageView at 2f2713d8; provenance is recorded in THIRD_PARTY_NOTICES.md.
const MAX_BYTES = 20 * 1024 * 1024;
const MIN = 1;
const MAX = 8;
const STEP = 1.6;
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
type View = { scale: number; x: number; y: number };
const FIT: View = { scale: MIN, x: 0, y: 0 };
type Point = { x: number; y: number };
type Gesture = { from: View; centre: Point; distance: number; moved: boolean };

export interface ImagePreviewProps {
  input: Blob | Uint8Array<ArrayBuffer>;
  alt: string;
  /** Used for byte arrays. SVG is displayed only in an img, never inserted as markup. */
  mimeType?: string;
  /** May lower the 20 MiB encoded-byte limit; decoded image memory is browser-owned. */
  maxBytes?: number;
  className?: string;
  onError?: ((error: Error) => void) | undefined;
}

/** A local image with bounded zoom and pan. This component never loads a network URL. */
export function ImagePreview({ input, alt, mimeType = "image/png", maxBytes, className, onError }: ImagePreviewProps) {
  const limit = previewLimit(maxBytes, MAX_BYTES);
  const [attempt, setAttempt] = useState(0);
  const [resource, setResource] = useState<{ input: typeof input; mimeType: string; attempt: number; limit: number; url?: string; error?: Error; oversized?: boolean }>();
  const report = useRef(onError);
  report.current = onError;
  useEffect(() => {
    const bytes = ArrayBuffer.isView(input);
    const size = bytes ? input.byteLength : input.size;
    if (size > limit) {
      const error = new RangeError(`Image preview is limited to ${limit.toLocaleString("en-US")} encoded bytes. Use a smaller file or download the original.`);
      setResource({ input, mimeType, attempt, limit, error, oversized: true });
      report.current?.(error);
      return;
    }
    let url: string | undefined;
    try {
      const blob = bytes ? new Blob([new Uint8Array(input).buffer], { type: mimeType }) : input;
      url = URL.createObjectURL(blob);
      setResource({ input, mimeType, attempt, limit, url });
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error("This browser could not open the image.");
      setResource({ input, mimeType, attempt, limit, error });
      report.current?.(error);
    }
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [input, mimeType, attempt, limit]);
  const current = resource?.input === input && resource.mimeType === mimeType && resource.attempt === attempt && resource.limit === limit ? resource : undefined;
  return <div className={["ui-preview-image", className].filter(Boolean).join(" ")}>
    <Picture key={current?.url ?? `pending-${attempt}`} src={current?.url} alt={alt} error={current?.error}
      onError={onError} oversized={current?.oversized ?? false} onRetry={() => setAttempt(value => value + 1)} />
  </div>;
}

function Picture({ src, alt, error, oversized, onError, onRetry }: {
  src: string | undefined; alt: string; error: Error | undefined; oversized: boolean;
  onError: ImagePreviewProps["onError"]; onRetry: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"loading" | "drawn" | "failed">("loading");
  const [view, setView] = useState<View>(FIT);
  const [easing, setEasing] = useState(false);
  const [percent, setPercent] = useState<number | null>(null);
  const viewRef = useRef(view);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<Gesture | null>(null);
  const lastTap = useRef({ at: -Infinity, x: 0, y: 0 });
  const pointerType = useRef("mouse");
  const drawn = state === "drawn" && !error;

  const bounded = (next: View): View => {
    const viewport = box.current, picture = image.current;
    if (!viewport || !picture || next.scale <= MIN) return FIT;
    const scale = clamp(next.scale, MIN, MAX);
    const x = Math.max(0, (picture.offsetWidth * scale - viewport.clientWidth) / 2);
    const y = Math.max(0, (picture.offsetHeight * scale - viewport.clientHeight) / 2);
    return { scale, x: clamp(next.x, -x, x), y: clamp(next.y, -y, y) };
  };
  const update = (next: View, animate = false) => {
    const result = bounded(next);
    viewRef.current = result;
    setView(result);
    setEasing(animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const picture = image.current;
    if (picture?.naturalWidth) setPercent(Math.round(picture.offsetWidth * result.scale / picture.naturalWidth * 100));
  };
  const zoomed = (was: View, next: number, point: Point): View => {
    const scale = clamp(next, MIN, MAX), ratio = scale / was.scale;
    return bounded({ scale, x: point.x - (point.x - was.x) * ratio, y: point.y - (point.y - was.y) * ratio });
  };
  const centre = (clientX: number, clientY: number): Point => {
    const rect = box.current?.getBoundingClientRect();
    return rect ? { x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height / 2 } : { x: 0, y: 0 };
  };
  const zoomBy = (factor: number) => update(zoomed(viewRef.current, viewRef.current.scale * factor, { x: 0, y: 0 }), true);
  const fit = () => update(FIT, true);
  const doublePress = (clientX: number, clientY: number) => {
    if (viewRef.current.scale > MIN) fit();
    else update(zoomed(viewRef.current, 2.5, centre(clientX, clientY)), true);
  };

  useLayoutEffect(() => {
    if (!drawn || !box.current || !image.current) return;
    const viewport = box.current, picture = image.current;
    // Tall images open at a reading width with their top visible. Fit still shows the whole image.
    const width = Math.min(960, picture.naturalWidth, Math.max(0, viewport.clientWidth - 48));
    const scale = picture.offsetWidth > 0 ? Math.min(MAX, width / picture.offsetWidth) : MIN;
    update(scale >= 1.5 && picture.offsetHeight * scale > viewport.clientHeight
      ? { scale, x: 0, y: (picture.offsetHeight * scale - viewport.clientHeight) / 2 } : FIT);
    const resize = () => update(viewRef.current);
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [drawn]);

  useEffect(() => {
    const viewport = box.current;
    if (!viewport || !drawn) return;
    const wheel = (event: WheelEvent) => {
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
      let dx = event.deltaX * unit, dy = event.deltaY * unit;
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        update(zoomed(viewRef.current, viewRef.current.scale * Math.exp(-clamp(dy, -50, 50) * .01), centre(event.clientX, event.clientY)));
      } else if (viewRef.current.scale > MIN) {
        event.preventDefault();
        if (event.shiftKey && dx === 0) [dx, dy] = [dy, 0];
        update({ ...viewRef.current, x: viewRef.current.x - dx, y: viewRef.current.y - dy });
      }
    };
    viewport.addEventListener("wheel", wheel, { passive: false });
    return () => viewport.removeEventListener("wheel", wheel);
  }, [drawn]);

  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!drawn || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey ||
      (event.target as HTMLElement).closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")) return;
    if (event.key === "+" || event.key === "=") zoomBy(STEP);
    else if (event.key === "-" || event.key === "_") zoomBy(1 / STEP);
    else if (event.key === "0") fit();
    else if (["ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(event.key) && viewRef.current.scale > MIN) {
      const amount = event.key.startsWith("Page") ? (box.current?.clientHeight ?? 400) * .85 : 80;
      update({ ...viewRef.current, y: viewRef.current.y + (["ArrowUp", "PageUp"].includes(event.key) ? amount : -amount) }, true);
    } else return;
    event.preventDefault();
  };
  const begin = () => {
    const [first, second] = [...pointers.current.values()];
    if (!first) return;
    gesture.current = { from: viewRef.current,
      centre: second ? { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 } : first,
      distance: second ? Math.hypot(first.x - second.x, first.y - second.y) : 0,
      moved: gesture.current?.moved ?? false };
  };
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (!drawn || (event.pointerType === "mouse" && event.button !== 0)) return;
    pointerType.current = event.pointerType;
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 1) gesture.current = null;
    begin();
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const held = gesture.current, [first, second] = [...pointers.current.values()];
    if (!held || !first) return;
    const middle = second ? { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 } : first;
    const dx = middle.x - held.centre.x, dy = middle.y - held.centre.y;
    if (!held.moved && Math.hypot(dx, dy) < 4 && !second) return;
    held.moved = true;
    if (second && held.distance > 0) {
      const next = zoomed(held.from, held.from.scale * Math.hypot(first.x - second.x, first.y - second.y) / held.distance, centre(held.centre.x, held.centre.y));
      update({ ...next, x: next.x + dx, y: next.y + dy });
    } else if (held.from.scale > MIN) update({ ...held.from, x: held.from.x + dx, y: held.from.y + dy });
  };
  const finish = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (pointers.current.size) { begin(); return; }
    const held = gesture.current;
    gesture.current = null;
    if (cancelled || !held || held.moved || event.pointerType === "mouse") return;
    const now = performance.now(), previous = lastTap.current;
    if (now - previous.at < 320 && Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < 24) {
      lastTap.current.at = -Infinity;
      doublePress(event.clientX, event.clientY);
    } else lastTap.current = { at: now, x: event.clientX, y: event.clientY };
  };

  return <>
    <FilePreviewToolbar label="Image controls" className="ui-preview-image-toolbar">
      <IconButton label="Zoom out" icon={<ZoomOutIcon size={18} />} disabled={!drawn || view.scale <= MIN} onClick={() => zoomBy(1 / STEP)} />
      <span className="ui-preview-image-percent" aria-live="polite" aria-atomic="true">{drawn && percent !== null ? `${percent}%` : ""}</span>
      <IconButton label="Zoom in" icon={<ZoomInIcon size={18} />} disabled={!drawn || view.scale >= MAX} onClick={() => zoomBy(STEP)} />
      <IconButton label="Fit image" icon={<ZoomFitIcon size={18} />} disabled={!drawn || view.scale === MIN} onClick={fit} />
    </FilePreviewToolbar>
    <div ref={box} className={["ui-preview-image-viewport", view.scale > MIN ? "is-zoomed" : "", easing ? "is-easing" : ""].filter(Boolean).join(" ")}
      tabIndex={drawn ? 0 : -1} role="region" aria-label={`${alt || "Image"} preview. Use plus or minus to zoom, and zero to fit.`}
      aria-busy={state === "loading" && !error} onKeyDown={keys} onPointerDown={down} onPointerMove={move}
      onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)} onLostPointerCapture={event => finish(event, true)}
      onDoubleClick={event => { if (drawn && pointerType.current === "mouse") doublePress(event.clientX, event.clientY); }}>
      {error || state === "failed" ? <FilePreviewStatus status="error" title={oversized ? "Image exceeds preview limit" : "Image could not be displayed"} message={oversized && error ? error.message : "Try again, or download the file to open it in another application."} {...(oversized ? {} : { onRetry })} /> : <>
        {!drawn ? <FilePreviewStatus status="loading" title="Loading image" /> : null}
        {src ? <img ref={image} src={src} alt={alt} draggable={false} className={drawn ? "" : "is-loading"}
          onLoad={() => setState("drawn")} onError={() => { setState("failed"); onError?.(new Error("Image could not be decoded.")); }}
          onTransitionEnd={() => setEasing(false)} style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }} /> : null}
      </>}
    </div>
  </>;
}
