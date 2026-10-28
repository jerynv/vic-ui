import { useState } from "react";
import { FileButton } from "vic-ui";
import { UploadIcon } from "vic-ui/icons";

export const title = "Choosing a file";
export const note = "A label drawn as the button, the file input inside it, so the keyboard reaches it as the pointer does. A held one says why on hover and focus.";

export default function Example() {
  const [chosen, setChosen] = useState("Nothing chosen yet.");
  return (
    <div className="demo-row">
      <FileButton label="Choose a photograph" accept="image/*" icon={<UploadIcon size={16} />} onChange={(event) => setChosen(event.target.files?.[0]?.name ?? "Nothing chosen yet.")}>
        Choose a photograph
      </FileButton>
      <FileButton label="Put a file in Documents" disabled disabledReason="Storage is full. An owner can buy more in Settings." onChange={() => undefined}>
        Upload
      </FileButton>
      <span className="demo-words">{chosen}</span>
    </div>
  );
}
