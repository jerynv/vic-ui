import { Table, type TableColumn } from "vic-ui";

export const title = "Read only, and empty";
export const note = "An empty table says what would fill it and how.";

const COLUMNS: TableColumn[] = [
  { key: "number", label: "Number", width: "6rem" },
  { key: "what", label: "What was asked" },
  { key: "state", label: "State", width: "7rem" },
];

const ROWS = [
  { number: 214, what: "New desk for the design team", state: "Open" },
  { number: 215, what: "Renew the office lease", state: "Done" },
];

export default function Example() {
  return (
    <div className="demo-wide">
      <Table aria-label="Requests" columns={COLUMNS} rows={ROWS} rowKey={(row) => String(row.number)} />
      <Table aria-label="No requests" columns={COLUMNS} rows={[] as typeof ROWS} rowKey={(row) => String(row.number)} empty="No requests yet. Open one from the list beside it." />
    </div>
  );
}
