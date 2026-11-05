import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { FocusLayout, FocusMark } from "../src/components/Focus";
import { ProviderButtons, ProviderChoice, type ProviderKind } from "../src/components/Providers";
import { FormSteps } from "../src/components/FormSteps";
import { Button } from "../src/components/Button";
import { LinkProvider } from "../src/components/Link";
import { CodeField } from "../src/components/CodeField";
import "../src/styles/tokens.css";
import "../src/styles/components/ui-canonical-focus-panes.css";
import "../src/styles/components/ui-canonical-focus-shell.css";
import "./canonical-focus-shell.fixture.css";
const qs = new URLSearchParams(location.search);
document.documentElement.dataset.mode = qs.get("theme") ?? "light";
const steps = [
  { value: "name", label: "Your name", description: "Enter a readable name." },
  { value: "code", label: "Verification", description: "Use the code you received." },
  { value: "branch", label: "Optional details", marker: "2.1" },
  { value: "done", label: "Finish" },
] as const;
type Step = typeof steps[number]["value"];
function Fixture() {
  const [chosen, setChosen] = useState<ProviderKind | "">("");
  const [notice, setNotice] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [providerList, setProviderList] = useState<readonly ProviderKind[]>(["google", "apple", "microsoft"]);
  const [continueCount, setContinueCount] = useState(0);
  const proceed = useRef<HTMLButtonElement>(null);
  const [step, setStep] = useState<Step>("code");
  const [reached, setReached] = useState<ReadonlySet<Step>>(new Set(["name", "code"]));
  const [stepDisabled, setStepDisabled] = useState(false);
  const [code, setCode] = useState("");
  const [back, setBack] = useState(0);
  const [submitted, setSubmitted] = useState(0);
  const [appearance, setAppearance] = useState(0);
  return <LinkProvider component={({ to, state: _state, ...rest }) => <a href={to} {...rest} data-host-link="" onClick={event => { event.preventDefault(); rest.onClick?.(event); }} />}>
    <FocusLayout title="Verify your details" org={qs.has("brand") ? undefined : { name: "Example workspace", slug: "example" }} brand={<a href="#brand" data-testid="host-brand">Host brand</a>}
      back={{ to: "/previous", label: "Previous step", onClick: () => setBack(back + 1) }}
      steps={[{ words: "Details", at: "done" }, { words: "Verify", at: "now" }, { words: "Review", at: "next" }]}
      actions={<Button look="quiet" onClick={() => setNotice(false)}>Reset notice</Button>}
      looksOnPhone renderAppearance={placement => <button type="button" aria-label={`Appearance ${placement}`} onClick={() => setAppearance(appearance + 1)}>Appearance</button>}
      renderArt={({ pulse }) => <div data-testid="host-art" data-pulse={pulse.n} data-amount={pulse.amount} />}
    >
      <p>Local controls only. No provider operation is performed.</p>
      {mounted && <ProviderChoice providers={providerList} verb="Continue with" disabled={disabled} onChoose={provider => { setChosen(provider); if (provider === "apple") setNotice(true); }}
        showNotice={notice} noticeFocusRef={proceed} notice={<><p className="ui-providers-said">A host-provided confirmation. Its words and any waiting policy belong to the host.</p><div className="ui-providers-acts"><Button ref={proceed} look="line" onClick={() => setContinueCount(continueCount + 1)}>Confirm locally</Button><Button look="quiet" onClick={() => setNotice(false)}>Cancel</Button></div></>} />}
      <output aria-label="Chosen provider">{chosen}</output><output aria-label="Confirmed count">{continueCount}</output>
      <div className="fixture-actions"><Button look="line" onClick={() => setMounted(!mounted)}>Toggle provider mount</Button><Button look="line" onClick={() => setDisabled(!disabled)}>Toggle providers disabled</Button><Button look="line" onClick={() => setProviderList(providerList.length ? [] : ["google", "apple", "microsoft"])}>Toggle providers</Button></div>
      <div className="fixture-inline"><ProviderButtons providers={["google", "apple"]} inline={{ size: "sm" }} verb="Use" onChoose={setChosen} /></div>
      <FormSteps steps={steps} current={step} reached={reached} disabled={stepDisabled} onChoose={setStep} />
      <output aria-label="Current form step">{step}</output>
      <div className="fixture-actions"><Button look="line" onClick={() => setReached(new Set(steps.map(one => one.value)))}>Reach all steps</Button><Button look="line" onClick={() => setStepDisabled(!stepDisabled)}>Toggle steps disabled</Button><Button look="line" onClick={() => { setStep("name"); setReached(new Set(["name"])); }}>Reset steps</Button></div>
      <form onSubmit={event => { event.preventDefault(); setSubmitted(submitted + 1); }}><CodeField label="Local code" value={code} onChange={setCode} /><Button type="submit" look="ink">Submit locally</Button></form>
      <output aria-label="Submitted count">{submitted}</output><output aria-label="Back count">{back}</output><output aria-label="Appearance count">{appearance}</output>
      <FocusMark name="Fallback workspace" logo="/missing-logo.svg" />
    </FocusLayout>
  </LinkProvider>;
}
createRoot(document.getElementById("root")!).render(<Fixture />);
