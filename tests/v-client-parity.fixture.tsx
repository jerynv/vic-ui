import { useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { CheckMark } from "../src/components/Checkbox";
import { ChoiceCards } from "../src/components/ChoiceCards";
import { Combobox } from "../src/components/Combobox";
import { FocusFrame, FocusLayout, useFocusFrame, type FocusStep } from "../src/components/Focus";
import { ProviderButtons, ProviderChoice, type ProviderKind } from "../src/components/Providers";
import { Surface } from "../src/components/Surface";
import { TextField } from "../src/components/TextField";
import { MagnifyingGlassIcon } from "../src/icons/icons";

declare global {
  interface Window {
    parity: { events: string[]; go: (() => void) | null; showPage: (shown: boolean) => void; showFrame: (which: "frame" | "alone" | "none") => void; framed: boolean[] };
  }
}
const events: string[] = [];
window.parity = { events, go: null, showPage: () => {}, showFrame: () => {}, framed: [] };
document.documentElement.dataset.mode = new URLSearchParams(location.search).get("theme") ?? "light";
// Every provider form is caught here, so a submit is recorded rather than followed.
document.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const submitter = (event as SubmitEvent).submitter;
  events.push(`submit ${form.getAttribute("action")} ${form.method} ${submitter?.getAttribute("data-provider") ?? "none"}`);
});

const people = [
  { value: "ada", label: "Ada Lovelace" },
  { value: "grace", label: "Grace Hopper" },
  { value: "alan", label: "Alan Turing" },
];
const steps: FocusStep[] = [{ words: "Pick a time", at: "now" }, { words: "Your details", at: "next" }];

function Fields() {
  const [title, setTitle] = useState("Weekly review");
  const [many, setMany] = useState<string[]>(["ada"]);
  const [one, setOne] = useState<string | null>(null);
  const [kind, setKind] = useState("none");
  return (
    <section>
      <TextField id="title-field" look="title" aria-label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
      <TextField id="title-small" size="sm" look="title" label="Small title" defaultValue="Review the new website" />
      <TextField id="plain-field" label="Plain field" defaultValue="Boxed" />
      <Surface surface="bordered">
        <TextField id="bordered-title" look="title" aria-label="Bordered title" defaultValue="No edge" />
        <TextField id="bordered-field" aria-label="Bordered field" defaultValue="Edged" />
      </Surface>
      <Combobox id="who" look="bare" aria-label="Who or where" items={people} values={many} onValuesChange={setMany} placeholder="Add" />
      <Combobox id="thin" size="xs" aria-label="Thin" items={people} value={one} onValueChange={setOne} placeholder="Thin" lead={<MagnifyingGlassIcon size={14} aria-hidden="true" />} />
      <Combobox id="dense" size="sm" aria-label="Dense" items={people} value={null} placeholder="Dense" />
      <Combobox id="forwarded" aria-label="Forwarded" items={people} value={null} size={undefined} look={undefined} lead={undefined} placeholder={undefined} disabledReason={undefined} />
      <ChoiceCards size="sm" className="compact-cards" legend="What should they submit?" name="kind" value={kind} onChange={setKind} items={[
        { value: "none", label: "No submission" },
        { value: "written", label: "Written answer" },
      ]} />
      <ChoiceCards legend="Roomy" name="roomy" value="a" onChange={() => {}} items={[{ value: "a", label: "Roomy card" }]} />
      <span id="mark-on"><CheckMark checked /></span>
      <span id="mark-off"><CheckMark checked={false} className="extra" /></span>
    </section>
  );
}

function Providers() {
  const [held, setHeld] = useState(false);
  return (
    <section>
      <div id="posting">
        <ProviderButtons providers={["google", "apple"]} verb="Continue with" action={(one) => `/auth/${one}/start`} onChoose={(one) => events.push(`choose ${one}`)} onLeave={() => events.push("leave")} />
      </div>
      <div id="holding">
        <ProviderButtons providers={["apple"]} verb="Hold" action={(one) => `/hold/${one}`} hold={(one, go) => { events.push(`hold ${one}`); window.parity.go = go; return true; }} />
      </div>
      <div id="disabled">
        <ProviderButtons providers={["microsoft"]} verb="Off" action={(one) => `/off/${one}`} disabled />
      </div>
      <div id="plain">
        <ProviderButtons providers={["google"]} verb="Pick" onChoose={(one: ProviderKind) => events.push(`plain ${one}`)} />
      </div>
      <fieldset id="fieldset" disabled={held}>
        <ProviderChoice providers={["microsoft"]} verb="Sign in with" action={(one) => `/choice/${one}`} />
      </fieldset>
      <button type="button" id="hold-fieldset" onClick={() => setHeld(true)}>Hold the fieldset</button>
    </section>
  );
}

function Page(props: { title: string; children: ReactNode }) {
  const framed = useFocusFrame({ title: props.title, tab: props.title, steps: [{ words: "Pick a time", at: "done" }, { words: "Your details", at: "now" }], back: { to: "#back", label: "Back", onClick: () => events.push("back") } });
  window.parity.framed.push(framed);
  if (framed) return <div id="page-body">{props.children}</div>;
  return <FocusLayout title={props.title} tab={props.title}>{props.children}</FocusLayout>;
}

function Frames() {
  const [page, setPage] = useState(false);
  const [frame, setFrame] = useState<"frame" | "alone" | "none">("frame");
  window.parity.showPage = setPage;
  window.parity.showFrame = setFrame;
  if (frame === "none") return null;
  return frame === "frame" ? (
    <div id="frame">
      <FocusFrame title="Book a demo" tab="Book a demo" steps={steps} brand={<span id="brand">Host brand</span>}>
        {page ? <Page title="Your details">Details form</Page> : <p id="loading">Loading</p>}
      </FocusFrame>
    </div>
  ) : (
    <div id="alone"><Page title="Alone">Alone form</Page></div>
  );
}

const which = new URLSearchParams(location.search).get("part");
createRoot(document.getElementById("root")!).render(which === "frames" ? <Frames /> : <main><Fields /><Providers /></main>);
