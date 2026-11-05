import { useEffect, useRef, useState } from "react";
import { readOfficeArchive, type OfficeInput } from "./zip";
import type { OfficeArchive } from "./xml";
export interface OfficePreviewProps { input: OfficeInput; title: string; maxBytes?: number; className?: string; onError?: (error: Error) => void }
export function useOffice<T>(input: OfficeInput, maxBytes: number, optionsKey: string, parse: (archive: OfficeArchive) => T, onError?: (error: Error) => void) {
  const [attempt, setAttempt] = useState(0);
  const [read, setRead] = useState<({ input: OfficeInput; maxBytes: number; optionsKey: string; attempt: number } & ({ value: T; status: "ready" } | { error: Error; status: "error" })) | null>(null);
  const parser = useRef(parse), report = useRef(onError);
  parser.current = parse; report.current = onError;
  useEffect(() => {
    const controller = new AbortController(), convert = parser.current;
    void readOfficeArchive(input, { maxBytes }, controller.signal).then(archive => {
      if (controller.signal.aborted) return;
      const value = convert(archive);
      if (!controller.signal.aborted) setRead({ input, maxBytes, optionsKey, attempt, value, status: "ready" });
    }).catch(cause => {
      if (controller.signal.aborted) return;
      const error = cause instanceof Error ? cause : new Error("The Office file could not be previewed.");
      setRead({ input, maxBytes, optionsKey, attempt, error, status: "error" }); report.current?.(error);
    });
    return () => controller.abort();
  }, [input, maxBytes, optionsKey, attempt]);
  const state = read?.input === input && read.maxBytes === maxBytes && read.optionsKey === optionsKey && read.attempt === attempt ? read : { status: "loading" as const };
  return { state, retry: () => setAttempt(value => value + 1) };
}
