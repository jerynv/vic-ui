import { useState } from "react";
import { Cell, Table, type TableColumn } from "vic-ui";
export const title = "Roster and independent cells";
export const note = "The owner cell acts independently of the row. The Updated column hides at phone widths; the scroller appears only when needed.";
const rows = [
  { id: "weekly", name: "Weekly report", owner: "Operations", updated: "Today" },
  { id: "monthly", name: "Monthly summary", owner: "Finance", updated: "Yesterday" },
];
const columns: TableColumn[] = [
  { key: "name", label: "Report" },
  { key: "owner", label: "Owner", width: "8rem" },
  { key: "updated", label: "Updated", width: "7rem", wide: true },
];
export default function Roster() {
  const [current, setCurrent] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);
  return <div className="demo-wide"><Table aria-label="Reports" look="roster" columns={columns} rows={rows}
    rowKey={row => row.id} currentKey={current} onRowPress={row => setCurrent(row.id)}
    cell={(row, column) => column.key === "owner"
      ? <Cell onPress={() => setOwner(row.owner)} tip="Show this owner">{row.owner}</Cell>
      : <Cell strong={column.key === "name"}>{column.key === "name" ? row.name : row.updated}</Cell>} />
    <p aria-live="polite">Report: {current ?? "none"}. Owner: {owner ?? "none"}.</p>
  </div>;
}
