import { useEffect, useRef, useState } from "react";

export type PreviewTextInput = Blob | Uint8Array<ArrayBuffer>;

/** Limits may be lowered, never raised above the renderer's bounded work budget. */
export function previewLimit(value: number | undefined, maximum: number): number {
  return value === undefined || !Number.isFinite(value) ? maximum : Math.max(1, Math.min(maximum, Math.floor(value)));
}

export async function readPreviewText(input: PreviewTextInput, maxBytes: number) {
  const size = input instanceof Uint8Array ? input.byteLength : input.size;
  const truncated = size > maxBytes;
  const bytes = input instanceof Uint8Array
    ? input.slice(0, maxBytes)
    : new Uint8Array(await input.slice(0, maxBytes).arrayBuffer());
  // Streaming leaves an incomplete trailing UTF-8 sequence buffered instead of inventing
  // a replacement glyph. A complete, intentionally written replacement glyph is retained.
  const text = new TextDecoder("utf-8").decode(bytes, { stream: truncated });
  return { text, truncated };
}

type ReadState = { input: PreviewTextInput; limit: number; attempt: number } & (
  | { status: "ready"; text: string; truncated: boolean }
  | { status: "error"; error: Error }
);

export function usePreviewText(input: PreviewTextInput, limit: number, onError?: (error: Error) => void) {
  const [attempt, setAttempt] = useState(0);
  const [read, setRead] = useState<ReadState | null>(null);
  const report = useRef(onError);
  report.current = onError;
  useEffect(() => {
    let current = true;
    void readPreviewText(input, limit).then(
      result => { if (current) setRead({ input, limit, attempt, status: "ready", ...result }); },
      cause => {
        if (!current) return;
        const error = cause instanceof Error ? cause : new Error("The file could not be read.");
        setRead({ input, limit, attempt, status: "error", error });
        report.current?.(error);
      },
    );
    return () => { current = false; };
  }, [input, limit, attempt]);
  const state = read?.input === input && read.limit === limit && read.attempt === attempt ? read : { status: "loading" as const };
  return { state, retry: () => setAttempt(value => value + 1) };
}

/** Normalise line endings while retaining only the requested number of lines. */
export function previewLines(text: string, maxLines: number) {
  const lines: string[] = [];
  let start = 0;
  for (let at = 0; at < text.length; at++) {
    if (text[at] !== "\r" && text[at] !== "\n") continue;
    lines.push(text.slice(start, at));
    if (text[at] === "\r" && text[at + 1] === "\n") at++;
    start = at + 1;
    if (lines.length === maxLines) return { lines, truncated: start < text.length };
  }
  if (start < text.length || lines.length === 0) lines.push(text.slice(start));
  return { lines, truncated: false };
}
