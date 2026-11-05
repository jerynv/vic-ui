import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Facts } from "../src/components/Facts";
import { Tree, type TreeItem } from "../src/components/Tree";
import { Button } from "../src/components/Button";
import { ClockIcon, FolderIcon } from "../src/icons/icons";
import "../src/styles/components/ui-canonical-tree-facts.css";
import "./canonical-tree-facts.fixture.css";

const folders: TreeItem[] = [
  { id: "projects", label: "Projects", icon: <FolderIcon size={16} />, children: [
    { id: "alpha", label: "Alpha", children: [{ id: "notes", label: "Notes" }] },
    { id: "beta", label: "Beta", end: "4 files" },
  ] },
  { id: "archive", label: "Archive", children: [{ id: "past", label: "Past work" }] },
  { id: "long", label: "A long folder name stays on one line and ends in an ellipsis when this panel narrows" },
  { id: "opaque|branch", label: "Opaque IDs", children: [{ id: "opaque|child", label: "Child with separator" }] },
];
function Fixture() {
  const [value, setValue] = useState<string | null>(null);
  const [accept, setAccept] = useState(true);
  const [showBeta, setShowBeta] = useState(true);
  const [items, setItems] = useState(folders);
  const [last, setLast] = useState("");
  const visible = showBeta ? items : items.map(item => item.id === "projects" ? { ...item, children: item.children?.filter(child => child.id !== "beta") ?? [] } : item);
  return <main>
    <h1>Facts and folders</h1>
    <Facts aria-label="Recording details" items={[
      { label: "Recorded", value: "Tuesday, November 3 at 10:30 AM" },
      { label: "Duration", value: "24 minutes", mark: <ClockIcon size={16} /> },
      { label: "Recorded by", value: "Alex Morgan" },
      { label: "Description", value: "A planning conversation with several follow-up notes" },
    ]} />
    <section aria-label="Folder example">
      <Tree aria-label="Project folders" items={visible} value={value} onValueChange={id => { setLast(id); if (accept) setValue(id); }} />
      <p>Selected: <output data-selection>{value ?? "None"}</output></p>
      <p>Last request: <output data-request>{last || "None"}</output></p>
    </section>
    <div className="fixture-actions">
      <Button look="line" onClick={() => setValue("notes")}>Choose nested note</Button>
      <Button look="line" onClick={() => setValue("opaque|child")}>Choose opaque child</Button>
      <Button look="line" onClick={() => setAccept(!accept)} aria-pressed={!accept}>Hold selection</Button>
      <Button look="line" onClick={() => setShowBeta(!showBeta)}>Toggle Beta</Button>
      <Button look="line" onClick={() => setItems(items.length ? [] : folders)}>Toggle empty tree</Button>
      <Button look="line" onClick={() => { setValue("late-leaf"); setItems([{ id: "late-root", label: "Arriving branch", children: [{ id: "late-leaf", label: "Arriving leaf" }] }]); }}>Replace folders</Button>
    </div>
    <Facts aria-label="No facts" items={[]} />
    <button type="button">After the example</button>
  </main>;
}
const query = new URLSearchParams(location.search);
document.documentElement.dataset.mode = query.get("theme") ?? "light";
createRoot(document.getElementById("root")!).render(<Fixture />);
