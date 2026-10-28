import { useMemo, useState } from "react";
import { Select, Table, TableToolbar, TextField, type TableColumn, type TableSort } from "vic-ui";

export const title = "Sorted, filtered, with a current row";
export const note = "One dense table, its head pinned while the body scrolls inside height. A press on a row makes it current.";

interface Person {
  id: string;
  name: string;
  role: string;
  space: string;
  requests: number;
  joined: string;
}

const PEOPLE: Person[] = [
  { id: "1", name: "Ines Marlow", role: "Owner", space: "Partners", requests: 12, joined: "2026-01-14" },
  { id: "2", name: "Tobias Wren", role: "Admin", space: "Operations", requests: 7, joined: "2026-02-03" },
  { id: "3", name: "Priya Sandeep", role: "Manager", space: "Clients", requests: 31, joined: "2026-03-22" },
  { id: "4", name: "Oskar Lind", role: "Member", space: "Clients", requests: 4, joined: "2026-04-09" },
  { id: "5", name: "Hana Okafor", role: "Member", space: "Operations", requests: 0, joined: "2026-05-17" },
  { id: "6", name: "Julien Barre", role: "Guest", space: "Clients", requests: 2, joined: "2026-06-30" },
  { id: "7", name: "Mira Castell", role: "Member", space: "Partners", requests: 118, joined: "2026-07-11" },
  { id: "8", name: "Felix Arden", role: "Manager", space: "Operations", requests: 19, joined: "2026-08-02" },
];

const COLUMNS: TableColumn[] = [
  { key: "name", label: "Name", sort: true },
  { key: "role", label: "Role", sort: true, width: "7rem" },
  { key: "space", label: "Space", width: "8rem" },
  { key: "requests", label: "Requests", align: "end", sort: true, width: "6rem" },
  { key: "joined", label: "Joined", align: "end", sort: true, width: "7rem" },
];

export default function Example() {
  const [sort, setSort] = useState<TableSort | null>({ key: "name", direction: "asc" });
  const [space, setSpace] = useState("every");
  const [find, setFind] = useState("");
  const [current, setCurrent] = useState<string | null>("3");
  const rows = useMemo(() => {
    const kept = PEOPLE.filter((one) => (space === "every" || one.space === space) && one.name.toLowerCase().includes(find.toLowerCase()));
    if (!sort) return kept;
    const key = sort.key as keyof Person;
    const sign = sort.direction === "asc" ? 1 : -1;
    return [...kept].sort((a, b) => (a[key] < b[key] ? -sign : a[key] > b[key] ? sign : 0));
  }, [sort, space, find]);
  return (
    <div className="demo-wide">
      <TableToolbar end={<span className="demo-words">{rows.length} of {PEOPLE.length}</span>}>
        <TextField aria-label="Find a person" size="sm" placeholder="Find a person" value={find} onChange={(event) => setFind(event.target.value)} />
        <Select size="sm" aria-label="Space" items={{ every: "Every space", Partners: "Partners", Operations: "Operations", Clients: "Clients" }} value={space} onValueChange={setSpace} />
      </TableToolbar>
      <Table
        aria-label="People"
        columns={COLUMNS}
        rows={rows}
        rowKey={(row) => row.id}
        sort={sort}
        onSortChange={setSort}
        onRowPress={(row) => setCurrent(row.id)}
        currentKey={current}
        height="14rem"
        empty="Nobody matches. Clear the search or choose every space."
      />
    </div>
  );
}
