import { useState } from "react";
import { Panel, PanelHead, PanelField, PanelItem, PanelText, Actions, Action } from "vic-ui";
import { Button } from "vic-ui";
export const title = "A panel of working rows";
export const note = "Quiet labels, linked places and local controls share the canonical panel surface.";
export default function PanelExample() {
  const [notes, setNotes] = useState("Keep the weekly notes together.");
  const [archived, setArchived] = useState(false);
  return <div style={{ width: "100%", maxWidth: "36rem" }}>
    <PanelHead>Workspace</PanelHead>
    <Panel as="dl"><PanelField label="Name">Field notes</PanelField><PanelField label="Visibility" note="Only invited people can read these notes">Private</PanelField></Panel>
    <PanelHead>Collections</PanelHead>
    <Panel as="ul"><PanelItem end={<Button look="quiet" onClick={() => setArchived(value => !value)}>{archived ? "Restore" : "Archive"}</Button>}>{archived ? "Archived notes" : "Weekly notes"}</PanelItem></Panel>
    <PanelHead>About</PanelHead><Panel><PanelText label="Workspace description" value={notes} onValueChange={setNotes} maxLength={180} placeholder="What belongs in this workspace?" /></Panel>
    <Actions><Action icon={null} onClick={() => setNotes("")}>Clear description</Action></Actions>
  </div>;
}
