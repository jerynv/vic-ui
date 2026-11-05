import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../src/components/Button";
import { TimeField } from "../src/components/TimeField";
import { TimePicker } from "../src/components/TimePicker";
import "./canonical-time.fixture.css";

document.documentElement.dataset.mode = new URLSearchParams(location.search).get("theme") ?? "light";
function App() {
  const [start, setStart] = useState(630), [end, setEnd] = useState(660), [bounded, setBounded] = useState(660);
  const [exact, setExact] = useState("09:30"), [limited, setLimited] = useState("09:30"), [empty, setEmpty] = useState("");
  const [refuse, setRefuse] = useState(false), [disabled, setDisabled] = useState(false), [mounted, setMounted] = useState(true);
  const [disableSuggestions, setDisableSuggestions] = useState(false);
  const [requests, setRequests] = useState(0), [badBounds, setBadBounds] = useState(false);
  const request = <T,>(setter: (value: T) => void, value: T) => { setRequests(n => n + 1); if (!refuse) setter(value); };
  return <main className="canonical-time-fixture"><h1>Time of day</h1><p>Typed suggestions and exact hour/minute selection.</p>
    <div className="canonical-time-controls">
      <label><input type="checkbox" checked={refuse} onChange={e => setRefuse(e.target.checked)} />Host refuses changes</label>
      <label><input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />Disable exact picker</label>
      <label><input type="checkbox" checked={disableSuggestions} onChange={e => setDisableSuggestions(e.target.checked)} />Disable suggestions</label>
      <label><input type="checkbox" checked={badBounds} onChange={e => setBadBounds(e.target.checked)} />Invalid picker bounds</label>
      <Button look="quiet" onClick={() => setMounted(!mounted)}>Toggle mounted controls</Button>
      <Button look="quiet" onClick={() => setExact("not a time")}>Set invalid external value</Button>
    </div>
    {mounted ? <form onSubmit={e => e.preventDefault()}><div className="canonical-time-grid">
      <section><TimeField label="Start time" value={start} onValueChange={v => request(setStart, v)} /><output aria-label="Start value">{start}</output></section>
      <section><TimeField label="End time" value={end} onValueChange={v => request(setEnd, v)} after={600} size="sm" /><output aria-label="End value">{end}</output></section>
      <section><TimeField label="Bounded suggestions" disabled={disableSuggestions} disabledReason="Suggestions are updating." value={bounded} onValueChange={v => request(setBounded, v)} min={645} max={675} after={645} durationLabel={m => `${m} minutes later`} /><output aria-label="Bounded value">{bounded}</output></section>
      <section><TimeField label="Unavailable suggestions" value={600} onValueChange={() => setRequests(n => n + 1)} disabled disabledReason="Choose a date first." /></section>
      <section><TimeField label="Invalid bounds" value={Number.NaN} onValueChange={() => setRequests(n => n + 1)} min={Infinity} /></section>
      <section><TimePicker id="exact-time" label="Exact time" name="exact" value={exact} onValueChange={v => request(setExact, v)} none="No time" disabled={disabled} disabledReason="Choose a date first." hint="24-hour clock" /><output aria-label="Exact value">{exact}</output></section>
      <section><TimePicker label="Office time" name="limited" value={limited} onValueChange={v => request(setLimited, v)} min={badBounds ? "18:00" : "09:00"} max="17:00" hint="09:00 to 17:00" size="sm" /><output aria-label="Limited value">{limited}</output></section>
      <section><TimePicker label="Optional time" value={empty} onValueChange={v => request(setEmpty, v)} none="Any time" /><output aria-label="Optional value">{empty}</output></section>
      <section><TimePicker label="Locked exact" value="11:00" onValueChange={() => setRequests(n => n + 1)} disabled disabledReason="Waiting for access." hint="Contact the host." error="Time is not available." aria-describedby="external-description" /><p id="external-description">External description</p></section>
      <section><TimePicker aria-label="Native disabled time" value="12:00" onValueChange={() => setRequests(n => n + 1)} disabled /></section>
    </div></form> : null}
    <output aria-label="Change requests">{requests}</output><Button look="line">After controls</Button>
  </main>;
}
createRoot(document.getElementById("root")!).render(<App />);
