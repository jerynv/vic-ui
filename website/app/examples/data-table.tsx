// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { DataTable, type DataTableColumnDef } from "vic-ui/ui";
const projects = [
  { name: "Website", status: "In progress", tasks: 24 },
  { name: "Design system", status: "In review", tasks: 18 },
  { name: "Mobile app", status: "Planned", tasks: 32 },
  { name: "Documentation", status: "In progress", tasks: 12 },
];
const columns: DataTableColumnDef<(typeof projects)[number]>[] = [
  { accessorKey: "name", header: "Project" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "tasks", header: "Tasks" },
];
export default function DataTableDemo() {
  return <DataTable columns={columns} data={projects} filterColumn="name" pageSize={3} />;
}
