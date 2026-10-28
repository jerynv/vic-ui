import { useState } from "react";
import { Textarea } from "vic-ui";

export const title = "Fixed, growing, counted and held";

export default function Example() {
  const [about, setAbout] = useState("");
  const [note, setNote] = useState("Asked for the March figures before the call on Thursday.");
  return (
    <div className="demo-stack">
      <Textarea label="What it is for" placeholder="A sentence or two" rows={3} maxLength={280} value={about} onValueChange={setAbout} hint="Shown under its name in the list." />
      <Textarea label="Note" grow rows={2} maxRows={6} value={note} onValueChange={setNote} hint="Grows with its words up to six lines." />
      <Textarea label="Reason" rows={2} defaultValue="" maxLength={120} error="Say why, so the record carries it." />
      <Textarea label="Refusal" size="sm" rows={2} defaultValue="Too long" maxLength={8} />
      <Textarea label="Agreement" rows={2} disabled defaultValue="Closed while the account is suspended." />
      <Textarea label="Agreement" rows={2} disabledReason="Only an owner can change what guests agree to." defaultValue="Guests keep what they see here to themselves." />
    </div>
  );
}
