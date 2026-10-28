import { useState } from "react";
import { Badge, Problem, Table, type TableColumn } from "vic-ui";

export const title = "Rows that open, and a line under a row";
export const note = "rowPressable says which rows onRowPress opens; a row that opens nothing lights nothing. after draws a line under a row across every column, read as part of it.";

const COLUMNS: TableColumn[] = [
  { key: "name", label: "Integration" },
  { key: "state", label: "State", width: "8rem" },
];

const ROWS = [
  { name: "Mail", state: "Working", open: true },
  { name: "Payments", state: "Needs a key", open: true },
  { name: "Calendar", state: "Not set up", open: false },
];

export default function Example() {
  const [opened, setOpened] = useState("Nothing opened yet.");
  return (
    <div className="demo-wide">
      <Table
        aria-label="Integrations"
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(row) => row.name}
        cell={(row, column) => (column.key === "state" ? <Badge tone={row.state === "Working" ? "settled" : "caution"}>{row.state}</Badge> : row.name)}
        onRowPress={(row) => setOpened(row.name)}
        rowPressable={(row) => row.open}
        after={(row) => (row.state === "Needs a key" ? <Problem as="span">Add the key in the environment, then send a test event.</Problem> : null)}
      />
      <span className="demo-words">Opened: {opened}</span>
    </div>
  );
}
