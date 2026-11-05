// Adapted from shadcn/ui's Base UI data-table guide (MIT), using TanStack Table v9.
import { useState } from "react";
import { columnFilteringFeature, columnVisibilityFeature, createFilteredRowModel, createPaginatedRowModel, createSortedRowModel, filterFn_includesString, rowPaginationFeature, rowSelectionFeature, rowSortingFeature, sortFn_alphanumeric, sortFn_basic, sortFn_datetime, sortFn_text, tableFeatures, useTable, type ColumnDef, type ColumnFiltersState, type OnChangeFn, type RowData, type RowSelectionState, type SortingState } from "@tanstack/react-table";
import { ArrowsSortIcon as ArrowUpDownIcon, ChevronDownIcon } from "@/icons/icons";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

// Keep emitted types on our declared React Table dependency instead of exposing
// inferred imports from its transitive table-core package.
type DataTableFeatures = {
  columnFilteringFeature: typeof columnFilteringFeature;
  columnVisibilityFeature: typeof columnVisibilityFeature;
  rowPaginationFeature: typeof rowPaginationFeature;
  rowSelectionFeature: typeof rowSelectionFeature;
  rowSortingFeature: typeof rowSortingFeature;
  filteredRowModel: ReturnType<typeof createFilteredRowModel>;
  paginatedRowModel: ReturnType<typeof createPaginatedRowModel>;
  sortedRowModel: ReturnType<typeof createSortedRowModel>;
  filterFns: { includesString: typeof filterFn_includesString };
  sortFns: { alphanumeric: typeof sortFn_alphanumeric; basic: typeof sortFn_basic; datetime: typeof sortFn_datetime; text: typeof sortFn_text };
};
export const dataTableFeatures: DataTableFeatures = tableFeatures({
  columnFilteringFeature, columnVisibilityFeature, rowPaginationFeature, rowSelectionFeature, rowSortingFeature,
  filteredRowModel: createFilteredRowModel(), paginatedRowModel: createPaginatedRowModel(), sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic, datetime: sortFn_datetime, text: sortFn_text },
});
export type DataTableColumnDef<TData extends RowData> = ColumnDef<typeof dataTableFeatures, TData>;
export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumnDef<TData>[];
  data: TData[];
  filterColumn?: string;
  pageSize?: number;
  selectable?: boolean;
  getRowId?: (row: TData, index: number) => string;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  "aria-label"?: string;
}

export function DataTable<TData extends RowData>({ columns, data, filterColumn, pageSize = 10, selectable = true, getRowId, rowSelection, onRowSelectionChange, "aria-label": label = "Records" }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selection, setSelection] = useState<RowSelectionState>({});
  const table = useTable({
    features: dataTableFeatures, data, columns, ...(getRowId ? { getRowId } : {}),
    initialState: { pagination: { pageIndex: 0, pageSize } },
    onSortingChange: setSorting, onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: onRowSelectionChange ?? setSelection,
    state: { sorting, columnFilters, rowSelection: rowSelection ?? selection },
  });
  const filter = filterColumn ? table.getColumn(filterColumn) : undefined;
  return <div className="grid gap-4">
    <div className="flex items-center gap-3">
      {filter && <Input aria-label="Filter records" placeholder="Filter records" className="max-w-sm" value={String(filter.getFilterValue() ?? "")} onChange={(event) => filter.setFilterValue(event.target.value)} />}
      <DropdownMenu><DropdownMenuTrigger render={<Button variant="outline" className="ml-auto" />}>Columns<ChevronDownIcon /></DropdownMenuTrigger>
        <DropdownMenuContent align="end">{table.getAllLeafColumns().filter((column) => column.getCanHide()).map((column) => <DropdownMenuCheckboxItem key={column.id} checked={column.getIsVisible()} onCheckedChange={(checked) => column.toggleVisibility(checked)}>{typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}</DropdownMenuCheckboxItem>)}</DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className="overflow-hidden rounded-(--radius-row) border"><Table aria-label={label}>
      <TableHeader>{table.getHeaderGroups().map((group) => <TableRow key={group.id}>
        {selectable && <TableHead><Checkbox aria-label="Select page" checked={table.getIsAllPageRowsSelected()} indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()} onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)} /></TableHead>}
        {group.headers.map((header) => <TableHead key={header.id} aria-sort={header.column.getIsSorted() === "asc" ? "ascending" : header.column.getIsSorted() === "desc" ? "descending" : "none"}>
          {header.isPlaceholder ? null : typeof header.column.columnDef.header === "string" && header.column.getCanSort() ? <Button variant="ghost" size="sm" onClick={header.column.getToggleSortingHandler()}>{header.column.columnDef.header}<ArrowUpDownIcon /></Button> : <table.FlexRender header={header} />}
        </TableHead>)}
      </TableRow>)}</TableHeader>
      <TableBody>{table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
        {selectable && <TableCell><Checkbox aria-label={`Select row ${row.id}`} checked={row.getIsSelected()} onCheckedChange={(checked) => row.toggleSelected(checked)} /></TableCell>}
        {row.getVisibleCells().map((cell) => <TableCell key={cell.id}><table.FlexRender cell={cell} /></TableCell>)}
      </TableRow>) : <TableRow><TableCell colSpan={table.getVisibleLeafColumns().length + Number(selectable)} className="h-24 text-center">No results.</TableCell></TableRow>}</TableBody>
    </Table></div>
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <span aria-live="polite">{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} selected</span>
      <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>Previous</Button><span>Page {table.state.pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}</span><Button variant="outline" size="sm" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>Next</Button></div>
    </div>
  </div>;
}
