import { Fragment, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref, type TableHTMLAttributes } from "react";
import { ArrowDownIcon } from "../icons/icons";

/** One column: its key, the words at its head, and how it sits. */
export interface TableColumn {
  key: string;
  label: ReactNode;
  /** `end` for numbers and amounts, which are also set in tabular numerals. */
  align?: "start" | "center" | "end";
  /** A CSS width (`"8rem"`, `"20%"`) or pixels. */
  width?: string | number;
  /** The head can be pressed to sort by this column. */
  sort?: boolean;
  /** On its `col`, its head and every cell of it, for a page that lets a column go where the room is short. */
  className?: string;
}

export interface TableSort {
  key: string;
  direction: "asc" | "desc";
}

/**
 * The one table: dense rows at the middle spacing, a head pinned to the top of its scroller,
 * every number in tabular numerals. Columns are data (`columns`), rows are data (`rows`, keyed
 * by `rowKey`), and `cell` draws a row's value for a column, its key read off the row where
 * no `cell` is given. A column with `sort` has a head that sorts: pressing it asks for that
 * column ascending, and again for descending, through `onSortChange`; the sorting is the
 * caller's. With `onRowPress` each row is pressable by pointer and by Enter or Space, and only
 * those `rowPressable` says, where some rows open nothing; a row that is not lights nothing. `empty`
 * fills the body when there are no rows. `height` caps the scroller so the head stays pinned
 * inside it; without it the head pins to the page's own scroller. `rowProps` and `tableProps`
 * add to a row and to the table what a page that works its rows itself needs (choosing,
 * dragging, a grid's keys), spread after the table's own. `after` draws a line of its own
 * under a row across every column, for what is wrong with it or still to do, read as part of it.
 */
export function Table<Row>(props: {
  columns: ReadonlyArray<TableColumn>;
  rows: ReadonlyArray<Row>;
  rowKey: (row: Row) => string;
  cell?: (row: Row, column: TableColumn) => ReactNode;
  sort?: TableSort | null;
  onSortChange?: (sort: TableSort) => void;
  onRowPress?: (row: Row) => void;
  /** Which rows `onRowPress` opens, where not every row goes somewhere; every row where it is not given. */
  rowPressable?: (row: Row) => boolean;
  /** A line under a row, across every column, where there is something more to say of it. */
  after?: (row: Row) => ReactNode;
  /** The row drawn as the one open beside the table. */
  currentKey?: string | null;
  empty?: ReactNode;
  "aria-label"?: string;
  height?: string;
  className?: string;
  rowProps?: (row: Row) => HTMLAttributes<HTMLTableRowElement> & { [data: `data-${string}`]: string | boolean | undefined };
  tableProps?: TableHTMLAttributes<HTMLTableElement>;
  tableRef?: Ref<HTMLTableElement>;
}) {
  const draw = props.cell ?? ((row: Row, column: TableColumn) => (row as Record<string, ReactNode>)[column.key]);
  const pressableAt = (row: Row) => props.onRowPress !== undefined && (props.rowPressable?.(row) ?? true);
  const sortBy = (column: TableColumn) => {
    const now = props.sort?.key === column.key ? props.sort.direction : null;
    props.onSortChange?.({ key: column.key, direction: now === "asc" ? "desc" : "asc" });
  };
  const keyed = (event: KeyboardEvent<HTMLTableRowElement>, row: Row) => {
    if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    props.onRowPress?.(row);
  };

  return (
    <div className={props.className ? `ui-table-scroll ${props.className}` : "ui-table-scroll"} style={props.height ? { maxHeight: props.height } : undefined} data-height={props.height ? "" : undefined}>
      <table ref={props.tableRef} className="ui-table" aria-label={props["aria-label"]} {...props.tableProps}>
        <colgroup>
          {props.columns.map((column) => (
            <col key={column.key} className={column.className} style={column.width !== undefined ? { width: typeof column.width === "number" ? `${column.width}px` : column.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {props.columns.map((column) => {
              const sorted = props.sort?.key === column.key ? props.sort.direction : null;
              return (
                <th key={column.key} scope="col" className={column.className} data-align={column.align ?? "start"} aria-sort={column.sort ? (sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none") : undefined}>
                  {column.sort ? (
                    <button type="button" className="ui-table-sort" data-sorted={sorted ?? undefined} onClick={() => sortBy(column)}>
                      <span>{column.label}</span>
                      <ArrowDownIcon size={12} className="ui-table-sort-mark" aria-hidden="true" />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {props.rows.length === 0 ? (
            <tr className="ui-table-empty">
              <td colSpan={props.columns.length}>{props.empty ?? "Nothing here yet."}</td>
            </tr>
          ) : (
            props.rows.map((row) => {
              const key = props.rowKey(row);
              const pressable = pressableAt(row);
              const more = props.after?.(row);
              return (
                <Fragment key={key}>
                  <tr
                    data-pressable={pressable ? "" : undefined}
                    aria-current={props.currentKey === key ? true : undefined}
                    tabIndex={pressable ? 0 : undefined}
                    onClick={pressable ? () => props.onRowPress?.(row) : undefined}
                    onKeyDown={pressable ? (event) => keyed(event, row) : undefined}
                    {...props.rowProps?.(row)}
                  >
                    {props.columns.map((column) => (
                      <td key={column.key} className={column.className} data-align={column.align ?? "start"}>
                        {draw(row, column)}
                      </td>
                    ))}
                  </tr>
                  {more ? (
                    <tr className="ui-table-after">
                      <td colSpan={props.columns.length}>{more}</td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
