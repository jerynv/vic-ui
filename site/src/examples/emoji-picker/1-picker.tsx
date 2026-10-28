import { useState } from "react";
import { EmojiPicker, IconButton } from "vic-ui";
import { SmileyIcon } from "vic-ui/icons";

export const title = "A picker on an icon button";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState("");
  return (
    <div className="demo-row">
      <EmojiPicker open={open} onOpenChange={setOpen} onPick={(one) => setPicked(picked + one)} trigger={(trigger) => <IconButton {...trigger} icon={<SmileyIcon size={16} />} label="Emoji" />} />
      <span className="demo-words">{picked === "" ? "Nothing picked yet" : `Picked ${picked}`}</span>
    </div>
  );
}
