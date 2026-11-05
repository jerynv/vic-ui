import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { CodeField } from "../src/components/CodeField";
import { PaneView, PaneViews } from "../src/components/PaneViews";
import { Grow } from "../src/components/Grow";
import { FocusFoot, FocusLine, FocusQuiet } from "../src/components/FocusLines";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../src/ui/input-otp";
import "../src/styles/components/ui-canonical-focus-panes.css";
import "./canonical-focus-panes.fixture.css";

const qs = new URLSearchParams(location.search);
document.documentElement.dataset.mode = qs.get("theme") ?? "light";
function StatefulPane({ name }: { name: string }) {
  const [text, setText] = useState("");
  useEffect(() => {
    const log = document.querySelector("#mounts");
    if (log) log.textContent += `${name}:mounted;`;
    return () => { if (log) log.textContent += `${name}:unmounted;`; };
  }, [name]);
  return <>
    <label>{name} note<input value={text} onChange={event => setText(event.target.value)} /></label>
    <div className="pane-scroll" tabIndex={0} aria-label={`${name} scroll`}><div className="pane-tall">Scroll remains with this pane.</div></div>
  </>;
}
function Fixture() {
  const [code, setCode] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [requested, setRequested] = useState("");
  const [pane, setPane] = useState("one");
  const [grow, setGrow] = useState(true);
  const [tall, setTall] = useState(false);
  const [contentKey, setContentKey] = useState("first");
  const [submit, setSubmit] = useState(0);
  return <main>
    <h1>Canonical focus controls</h1>
    <section data-testid="codes">
      <h2>One-time code</h2>
      <CodeField label="Verification code" value={code} onChange={setCode} disabled={disabled} error={error ? "That code expired" : undefined} autoFocus />
      <output aria-label="Code value">{code}</output>
      <div><button onClick={() => setDisabled(!disabled)}>Toggle code disabled</button><button onClick={() => setError(!error)}>Toggle code error</button><button onClick={() => setCode("")}>Clear code</button></div>
      <CodeField label="Host controlled code" value="12" onChange={setRequested} />
      <output aria-label="Code requests">{requested}</output>
      <div data-testid="old-otp"><InputOTP maxLength={6} aria-label="Existing OTP"><InputOTPGroup>{Array.from({ length: 6 }, (_, i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup></InputOTP></div>
    </section>
    <section>
      <h2>Focus text</h2>
      <FocusLine>A code was sent to the address you chose. These words wrap at narrow widths.</FocusLine>
      <FocusQuiet><button>Send another code</button><button>Use another address</button></FocusQuiet>
      <FocusQuiet action="/local-form" onSubmit={event => { event.preventDefault(); setSubmit(submit + 1); }}><button type="submit">Local form action</button></FocusQuiet>
      <output aria-label="Submitted">{submit}</output>
      <FocusFoot>Read the <a href="#terms">terms</a>.</FocusFoot>
    </section>
    <section>
      <h2>Persistent panes</h2>
      <output id="mounts" aria-label="Pane lifecycle" />
      <button onClick={() => setPane(pane === "one" ? "two" : "one")}>Switch pane</button>
      <PaneViews active={pane}>
        <PaneView value="one" hidden={false} inert={false}><StatefulPane name="First" /></PaneView>
        <PaneView value="two" hidden={false} inert={false}><StatefulPane name="Second" /></PaneView>
      </PaneViews>
    </section>
    <section>
      <h2>Measured content</h2>
      <div><button onClick={() => setGrow(!grow)}>Toggle Grow</button><button onClick={() => setTall(!tall)}>Resize content</button><button onClick={() => setContentKey(contentKey === "first" ? "second" : "first")}>Replace content</button></div>
      {grow && <Grow remember="fixture-step" contentKey={contentKey} className="grow-fixture" innerClassName="grow-content"><div style={{ height: tall ? 180 : 60 }}>The host owns this content.</div></Grow>}
    </section>
  </main>;
}
createRoot(document.getElementById("root")!).render(<Fixture />);
