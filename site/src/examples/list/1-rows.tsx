import { useState } from "react";
import { Button, EmptyLine, Row, RowGroup, Rows } from "vic-ui";
import { FileTextIcon, FilePresentationIcon, FileSpreadsheetIcon, BookmarkIcon } from "vic-ui/icons";

export const title = "Files with context and actions";
export const note = "Keep the title first, supporting details below it, and one action at the end. Save a file to try the action without opening the row.";

const files = [
  { name: "Project brief", detail: "Maya Chen · Product", time: "2 hours ago", Icon: FileTextIcon },
  { name: "Launch presentation", detail: "Alex Morgan · Design", time: "Yesterday", Icon: FilePresentationIcon },
  { name: "Quarterly budget", detail: "Sam Rivera · Finance", time: "Oct 21", Icon: FileSpreadsheetIcon },
];

export default function Example() {
  const [saved, setSaved] = useState<string[]>([]);
  return <div className="demo-stack" style={{ maxWidth: "40rem", gap: "1.5rem" }}>
    <RowGroup title="Recent files" count={files.length}>
      <Rows>{files.map(({ name, detail, time, Icon }) => <Row key={name}
        mark={<Icon size={20} />} words={name} description={detail} when={time}
        end={<Button look="line" square aria-label={`${saved.includes(name) ? "Unsave" : "Save"} ${name}`} aria-pressed={saved.includes(name)}
          onClick={() => setSaved(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name])}>
          <BookmarkIcon size={16} />
        </Button>} />)}</Rows>
    </RowGroup>
    <RowGroup title="Saved files" count={saved.length}>
      {saved.length ? <Rows>{saved.map(name => <Row key={name} mark={<BookmarkIcon size={18} />} words={name} description="Saved for quick access" />)}</Rows>
        : <EmptyLine>Save a file to keep it here.</EmptyLine>}
    </RowGroup>
  </div>;
}
