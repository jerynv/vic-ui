import { useEffect, useState } from "react";
import { Button, TextField, Checkbox } from "vic-ui";
import { SettingsDialog, SettingsPane } from "vic-ui";
export const title = "Sections with one Save";
export const note = "The host owns navigation, draft changes and saving. Switching sections preserves their controls.";
export default function SettingsDialogExample() {
  const [ready, setReady] = useState(false); useEffect(() => setReady(true), []);
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("general");
  const [name, setName] = useState("Field notes");
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState({ name: "Field notes", shared: false });
  const changes = Number(name !== saved.name) + Number(shared !== saved.shared);
  return <><Button look="line" disabled={!ready} onClick={() => setOpen(true)}>Workspace settings</Button>
    <SettingsDialog title="Field notes" eyebrow="Workspace" open={open} onOpenChange={setOpen}
      sections={[{ value: "general", label: "General" }, { value: "sharing", label: "Sharing" }]}
      section={section} onSection={setSection} changes={changes} onSubmit={() => { setSaved({ name, shared }); setOpen(false); }}>
      <SettingsPane value="general" label="General settings"><TextField label="Workspace name" value={name} onChange={event => setName(event.target.value)} placeholder="Give this workspace a name" /></SettingsPane>
      <SettingsPane value="sharing" label="Sharing settings"><Checkbox checked={shared} onCheckedChange={setShared} label="Let invited people add notes" /></SettingsPane>
    </SettingsDialog>
  </>;
}
