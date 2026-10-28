import { useState } from "react";
import { Badge, Button, Menu, Switch, type MenuItem } from "vic-ui";
import { CheckCircleIcon, GearIcon, MoonIcon, SignOutIcon } from "vic-ui/icons";

export const title = "A head, words at the end and a control in a row";
export const note = "head stands over every row and the keys pass over it. end puts a quiet word at a row's end. A row given a control holds it at its end: the arrows reach the row as they reach an action, and the focus goes into the control, whose own keys then work it.";

export default function Example() {
  const [dark, setDark] = useState(false);
  const [said, setSaid] = useState("Nothing chosen yet.");
  const items: MenuItem[] = [
    {
      head: (
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <strong>Ines Okafor</strong>
          <Badge>Owner</Badge>
        </span>
      ),
    },
    { label: "Getting started", icon: <CheckCircleIcon size={16} />, end: "3 of 5", onSelect: () => setSaid("Getting started") },
    { label: "Settings", icon: <GearIcon size={16} />, onSelect: () => setSaid("Settings") },
    { label: "Dark mode", icon: <MoonIcon size={16} />, control: <Switch aria-label="Dark mode" checked={dark} onCheckedChange={setDark} /> },
    { separator: true },
    { label: "Sign out", icon: <SignOutIcon size={16} />, onSelect: () => setSaid("Sign out") },
  ];
  return (
    <div className="demo-row">
      <Menu
        aria-label="You"
        items={items}
        trigger={(t) => (
          <Button look="line" {...t}>
            You
          </Button>
        )}
      />
      <span className="demo-words">
        Chosen: {said} Dark mode: {dark ? "on" : "off"}.
      </span>
    </div>
  );
}
