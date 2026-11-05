import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Panel, PanelHead, PanelField, PanelItem, PanelBlock, PanelText, Actions, Action } from "../src/components/Panel";
import { ModeChoice, type ModeChoiceValue } from "../src/components/ModeChoice";
import { SettingsDialog, SettingsPane } from "../src/components/SettingsDialog";
import { SettingsSection } from "../src/components/Settings";
import { Button } from "../src/components/Button";
import { TextField } from "../src/components/TextField";
import { LinkProvider, type LinkProps } from "../src/components/Link";
import "./canonical-panels.fixture.css";

function AppLink({ to, state: _state, ...props }: LinkProps) {
  return <a {...props} href={`#host${to}`} data-host-link />;
}
function App() {
  const [mode, setMode] = useState<ModeChoiceValue>("system");
  const [about, setAbout] = useState("One small workspace.");
  const [commits, setCommits] = useState(0);
  const [error, setError] = useState(false);
  const [actions, setActions] = useState(0);
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("general");
  const [name, setName] = useState("Field notes");
  const [submitted, setSubmitted] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [hold, setHold] = useState(false);
  const [problem, setProblem] = useState(false);
  useEffect(() => { document.documentElement.dataset.mode = new URLSearchParams(location.search).get("theme") ?? "light"; }, []);
  const changes = name === "Field notes" ? 0 : 1;
  return <LinkProvider component={AppLink}><main className="canonical-panel-fixture">
    <h1>Canonical panels</h1>
    <PanelHead actions={<Button look="quiet" onClick={() => setError(value => !value)}>Toggle field error</Button>}>Workspace</PanelHead>
    <Panel as="dl" aria-label="Workspace facts">
      <PanelField label="Name" note="Visible to your team" error={error ? "Choose a shorter name" : null}>Field notes</PanelField>
      <PanelField label="Contact" error={error ? "Add a contact" : null}>team@example.test</PanelField>
      <PanelField label="Editable label" control><TextField aria-label="Panel input" placeholder="Workspace name" /></PanelField>
    </Panel>
    <PanelHead>Linked places</PanelHead>
    <Panel as="ul" aria-label="Places">
      <PanelItem mark={<span aria-hidden>↗</span>} to="/workspace" end={<span aria-hidden>›</span>}>Open workspace</PanelItem>
      <PanelItem href="https://example.test/help" mono>Reference 1002</PanelItem>
      <PanelItem action={<Button look="quiet" onClick={() => setActions(n => n + 1)}>Archive item</Button>} after={<span className="fixture-after">A separate action keeps the row mounted.</span>}>Draft notes</PanelItem>
      <PanelBlock label="About" note="A wrapped description can take several lines."><p>Local presentation only, with host-owned state and actions.</p></PanelBlock>
    </Panel>
    <PanelHead>Notes</PanelHead>
    <Panel><PanelText label="Workspace notes" error={error ? "Describe this workspace" : null} value={about} onValueChange={setAbout} onCommit={() => setCommits(n => n + 1)} maxLength={120} placeholder="Describe the workspace" /></Panel>
    <output aria-label="Blur commits">{commits}</output>
    <PanelHead>Appearance</PanelHead><ModeChoice value={mode} onChange={setMode} />
    <output aria-label="Appearance value">{mode}</output>
    <Actions aria-label="Workspace actions">
      <Action icon={<span aria-hidden>↗</span>} to="/workspace">Open settings</Action>
      <Action icon={<span aria-hidden>×</span>} danger onClick={() => setActions(n => n + 1)}>Remove workspace</Action>
      <Action icon={null} to="/blocked" disabled>Unavailable link</Action>
      <Action icon={<span aria-hidden>×</span>} disabled onClick={() => setActions(n => n + 1)}>Unavailable action</Action>
    </Actions>
    <output aria-label="Action count">{actions}</output>
    <SettingsSection title="Existing generic heading" titleId="existing-heading" headingProps={{ tabIndex: -1 }}><p>Separate API and classes stay intact.</p></SettingsSection>
    <Button look="line" onClick={() => setOpen(true)}>Open object settings</Button>
    <output aria-label="Save count">{submitted}</output>
    <SettingsDialog open={open} onOpenChange={setOpen} eyebrow="Workspace" title="Field notes settings"
      sections={[{ value: "general", label: "General", state: changes ? <span aria-label="Unsaved changes">•</span> : null }, { value: "details / notes", label: "Details" }]}
      section={section} onSection={next => { if (!hold) setSection(next); }} changes={changes} disabled={disabled} disabledReason="Saving is unavailable."
      problem={problem ? "The host could not save. Try again." : undefined} onSubmit={() => setSubmitted(n => n + 1)}>
      <SettingsPane value="general" label="General settings">
        <TextField label="Workspace title" value={name} onChange={event => setName(event.target.value)} />
        <label><input type="checkbox" checked={disabled} onChange={event => setDisabled(event.target.checked)} />Disable saving</label>
        <label><input type="checkbox" checked={hold} onChange={event => setHold(event.target.checked)} />Hold selected section</label>
        <label><input type="checkbox" checked={problem} onChange={event => setProblem(event.target.checked)} />Show host refusal</label>
      </SettingsPane>
      <SettingsPane value="details / notes" label="Details settings"><TextField label="Persistent note" defaultValue="Kept between sections" />{Array.from({ length: 12 }, (_, n) => <p key={n}>Detail line {n + 1}</p>)}</SettingsPane>
    </SettingsDialog>
  </main></LinkProvider>;
}
createRoot(document.getElementById("root")!).render(<App />);
