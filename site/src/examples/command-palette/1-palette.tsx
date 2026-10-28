import { useState } from "react";
import { Button, CommandPalette, type PaletteOption } from "vic-ui";
import { ChatsCircleIcon, ClipboardTextIcon, FileTextIcon, FoldersIcon } from "vic-ui/icons";

export const title = "Found, looking and nothing found";
export const note = "Results in groups with a crumb under each. A press with a modifier asks for a new tab, and onSelect is told so.";

const FOUND: PaletteOption[] = [
  { value: "space:design", label: "Design reviews", start: <FoldersIcon size={16} />, crumb: "Space", hint: "Every brief before it goes out", group: "Places" },
  { value: "channel:design", label: "design-desk", start: <ChatsCircleIcon size={16} />, crumb: "Channel in Design reviews", group: "Places" },
  { value: "request:41", label: "New desk for the design team", start: <ClipboardTextIcon size={16} />, crumb: "Request 41 in Operations", group: "Requests" },
  { value: "request:60", label: "Archived design request", start: <ClipboardTextIcon size={16} />, crumb: "Request 60", disabled: true, group: "Requests" },
  { value: "document:9", label: "Design principles", start: <FileTextIcon size={16} />, crumb: "Document in Design reviews", group: "Documents" },
];

export default function Example() {
  const [open, setOpen] = useState<"" | "list" | "loading" | "empty">("");
  const [typed, setTyped] = useState("");
  const [said, setSaid] = useState("Nothing chosen yet.");
  const close = () => {
    setOpen("");
    setTyped("");
  };
  return (
    <div className="demo-row">
      <Button onClick={() => setOpen("list")}>Open the palette</Button>
      <Button look="line" onClick={() => setOpen("loading")}>
        While it looks
      </Button>
      <Button look="line" onClick={() => setOpen("empty")}>
        With nothing found
      </Button>
      <span className="demo-words">{said}</span>
      <CommandPalette
        open={open !== ""}
        onOpenChange={(next) => !next && close()}
        query={typed}
        onQueryChange={setTyped}
        items={open === "list" ? FOUND : []}
        loading={open === "loading"}
        empty={typed.trim() ? `Nothing mentions “${typed.trim()}”.` : "Search people, places, requests and documents."}
        onSelect={(value, how) => {
          setSaid(how.newTab ? `${value} in a new tab` : value);
          close();
        }}
      />
    </div>
  );
}
