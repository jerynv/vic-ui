import { useState } from "react";
import { Tree, type TreeItem } from "vic-ui";
import { FolderIcon } from "vic-ui/icons";

export const title = "Places and their folders";
export const note = "Arrow keys move through visible rows. Enter chooses; the host keeps the selected value.";
const places: TreeItem[] = [
  { id: "projects", label: "Projects", icon: <FolderIcon size={16} />, children: [
    { id: "research", label: "Research", children: [{ id: "notes", label: "Notes" }] },
    { id: "guides", label: "Guides", end: "4 files" },
  ] },
  { id: "archive", label: "Archive", icon: <FolderIcon size={16} />, children: [{ id: "past", label: "Past work" }] },
];
export default function TreeExample() {
  const [value, setValue] = useState<string | null>("research");
  return <Tree items={places} value={value} onValueChange={setValue} aria-label="Project folders" />;
}
