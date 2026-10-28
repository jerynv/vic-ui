import { useState } from "react";
import { Button, Menu, type MenuItem } from "vic-ui";
import { CopyIcon, DotsThreeIcon, PencilSimpleIcon, PushPinIcon, TrashIcon } from "vic-ui/icons";

export const title = "Actions, groups and held items";
export const note = "An item can carry an icon and a hint, be disabled, or say why it is held. A danger item is told in the danger ink.";

export default function Example() {
  const [said, setSaid] = useState("Nothing chosen yet.");
  const items: MenuItem[] = [
    { label: "Edit message", icon: <PencilSimpleIcon size={16} />, onSelect: () => setSaid("Edit message") },
    { label: "Copy link", icon: <CopyIcon size={16} />, onSelect: () => setSaid("Copy link") },
    { label: "Pin to the conversation", icon: <PushPinIcon size={16} />, hint: "Everybody in it sees it at the top", onSelect: () => setSaid("Pin") },
    { label: "Forward", disabled: true, onSelect: () => setSaid("Forward") },
    { label: "Move to a space", disabledReason: "Only an owner or an admin can move a message.", onSelect: () => setSaid("Move") },
    { separator: true },
    { group: "Danger" },
    { label: "Delete message", icon: <TrashIcon size={16} />, danger: true, onSelect: () => setSaid("Delete message") },
  ];
  return (
    <div className="demo-row">
      <Menu
        aria-label="Message"
        items={items}
        trigger={(t) => (
          <Button look="line" icon={<DotsThreeIcon size={16} />} {...t}>
            Actions
          </Button>
        )}
      />
      <Menu
        aria-label="Short"
        placement="bottom-end"
        items={[
          { label: "Mark as read", onSelect: () => setSaid("Mark as read") },
          { label: "Mute", onSelect: () => setSaid("Mute") },
        ]}
        trigger={(t) => (
          <Button look="quiet" {...t}>
            Two plain actions
          </Button>
        )}
      />
      <span className="demo-words">Chosen: {said}</span>
    </div>
  );
}
