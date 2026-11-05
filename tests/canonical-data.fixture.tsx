import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Table, Cell, type TableColumn, type TableSort } from "../src/components/Table";
import { RowButton } from "../src/components/List";
import "../src/styles/tokens.css";
import "../src/styles/components/ui-canonical-data.css";
import "./canonical-data.fixture.css";
const theme = new URLSearchParams(location.search).get("theme") ?? "light";
document.documentElement.dataset.mode = theme;
const columns: TableColumn[] = [{ key: "name", label: "Name", sort: true }, { key: "place", label: "Place", wide: true }];
function Example() {
  const [rows, setRows] = useState(0), [cells, setCells] = useState(0), [actions, setActions] = useState(0);
  const [sort, setSort] = useState<TableSort>({ key: "name", direction: "asc" });
  const [narrow, setNarrow] = useState(true), [mounted, setMounted] = useState(true), [capped, setCapped] = useState(false);
  return <main>
    <h1>Canonical rows and tables</h1>
    <section aria-label="Row actions">
      <RowButton icon={<span aria-hidden="true">+</span>} onClick={() => setActions(v => v + 1)}>Create item</RowButton>
      <RowButton face={<span aria-hidden="true">A</span>} disabled>Unavailable person</RowButton>
      <output aria-label="Action count">{actions}</output>
    </section>
    <section aria-label="Roster">
      <Table look="roster" aria-label="People" columns={columns} rows={[{ id: "a", name: "Ada", place: "Design" }]}
        rowKey={r => r.id} onRowPress={() => setRows(v => v + 1)} sort={sort} onSortChange={setSort}
        cell={(r, c) => c.key === "name" ? <Cell strong mark="A" onPress={() => setCells(v => v + 1)} tip="Filter by person">{r.name}</Cell> : <Cell quiet>{r.place}</Cell>} />
      <output aria-label="Row count">{rows}</output><output aria-label="Cell count">{cells}</output>
    </section>
    <button onClick={() => setNarrow(v => !v)}>Resize container</button>
    <button onClick={() => setCapped(v => !v)}>Toggle height</button>
    <button onClick={() => setMounted(v => !v)}>Toggle table</button>
    <div className="fit-container" style={{ width: narrow ? 180 : 740 }}>
      {mounted && <Table aria-label="Wide values" {...(capped ? { height: "100px" } : {})}
        columns={[{ key: "name", label: "A long unbroken field" }]} rows={[{ name: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJ" }]} rowKey={r => r.name} />}
    </div>
  </main>;
}
createRoot(document.getElementById("root")!).render(<Example />);
