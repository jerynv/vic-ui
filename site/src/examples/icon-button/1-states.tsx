import { useState } from "react";
import { IconButton } from "vic-ui";
import { CopyIcon, MicrophoneIcon, MicrophoneOffIcon, PlusIcon, TrashIcon, XIcon } from "vic-ui/icons";

export const title = "Looks and states";
export const note = "Quiet by default, line beside fields. aria-pressed fills it, busy turns the icon into a spinner and holds the press.";

export default function Example() {
  const [mic, setMic] = useState(true);
  const [busy, setBusy] = useState(false);
  return (
    <div className="demo-row">
      <IconButton icon={<CopyIcon size={16} />} label="Copy the words" />
      <IconButton size="lg" icon={<XIcon size={18} />} label="Close" />
      <IconButton look="line" icon={<PlusIcon size={16} />} label="Make a channel" />
      <IconButton look="line" aria-pressed={mic} label={mic ? "Turn the microphone off" : "Turn the microphone on"} icon={mic ? <MicrophoneIcon size={16} /> : <MicrophoneOffIcon size={16} />} onClick={() => setMic(!mic)} />
      <IconButton icon={<TrashIcon size={16} />} label="Take it back" tip="Take it back, for everybody" />
      <IconButton
        look="line"
        busy={busy}
        icon={<CopyIcon size={16} />}
        label="Busy for a second"
        onClick={() => {
          setBusy(true);
          window.setTimeout(() => setBusy(false), 1000);
        }}
      />
      <IconButton icon={<XIcon size={16} />} label="Put away" disabled />
      <IconButton icon={<XIcon size={16} />} label="Put away" disabled disabledReason="Put away once nothing is running" />
    </div>
  );
}
