import { useEffect, useMemo, useState } from "react";
import { ButtonLink, Choice, FilePreviewStage, FilePreviewStatus, FilePreviewToolbar, TextPreview } from "vic-ui";
import { DownloadSimpleIcon } from "vic-ui/icons";

export const title = "Loading, recovery and unsupported files";
export const note = "Choose a host state in either theme. Loading resolves to the local text sample; Try again follows the same flow. An unsupported file can still be downloaded.";

type State = "ready" | "loading" | "error" | "unsupported";
const source = "Preview ready.\n\nThe host supplied this local sample after retry.\nThe preview library did not fetch it.\n";

export default function Example() {
  const input = useMemo(() => new Blob([source], { type: "text/plain" }), []);
  const [state, setState] = useState<State>("error");
  useEffect(() => {
    if (state !== "loading") return;
    const timer = window.setTimeout(() => setState("ready"), 700);
    return () => window.clearTimeout(timer);
  }, [state]);
  const name = state === "unsupported" ? "design-package.sample" : "readme.txt";
  return <div className="demo-wide">
    <FilePreviewToolbar label="Demonstration state">
      {(["ready", "loading", "error", "unsupported"] as const).map(value =>
        <Choice key={value} chosen={state === value} onClick={() => setState(value)}>{value.charAt(0).toUpperCase() + value.slice(1)}</Choice>)}
    </FilePreviewToolbar>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))", gap: "1rem" }}>
      {(["light", "dark"] as const).map(mode => <section key={mode} data-mode={mode} aria-label={`${mode} preview states`} className="demo-wide">
        <h4>{mode === "light" ? "Light" : "Dark"}</h4>
        <FilePreviewStage file={{ id: "local-sample-v1", name, size: input.size }}>
          {state === "ready" ? <TextPreview input={input} name={name} /> : <FilePreviewStatus status={state}
            message={state === "loading" ? "Preparing the local text sample." : state === "error" ? "The sample read failed. Try again to open the local text file." : "This custom file format has no renderer. Download the sample to inspect its contents."}
            {...(state === "error" ? { onRetry: () => setState("loading") } : {})}
            actions={state === "unsupported" ? <ButtonLink look="line" href={`data:text/plain;charset=utf-8,${encodeURIComponent(source)}`} download={name}
              icon={<DownloadSimpleIcon size={16} />}>Download sample</ButtonLink> : undefined} />}
        </FilePreviewStage>
      </section>)}
    </div>
  </div>;
}
