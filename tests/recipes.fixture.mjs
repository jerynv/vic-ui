import { createElement as h, useState } from "react";
import { DataTable, DatePicker, TypographyH1 } from "../dist/ui.js";

const data = Array.from({ length: 12 }, (_, index) => ({ id: String(index), name: `Project ${String.fromCharCode(65 + index)}`, cost: 10 - index }));
const columns = [{ accessorKey: "name", header: "Name" }, { accessorKey: "cost", header: "Cost", sortFn: "basic" }];
export function RecipesFixture() {
  const [date, setDate] = useState(new Date(2026, 10, 4));
  return h("main", { style: { maxWidth: 800, padding: 24, margin: "auto", display: "grid", gap: 24 } },
    h(TypographyH1, {}, "Projects"),
    h(DataTable, { data, columns, filterColumn: "name", pageSize: 5, getRowId: (row) => row.id }),
    h("form", { id: "deadline" }, h(DatePicker, { value: date, onValueChange: setDate, name: "deadline" })),
  );
}
