/** Adapted from V-Client's TableView parser; source pin and transfer are recorded in THIRD_PARTY_NOTICES. */
export interface DelimitedGrid {
  rows: string[][];
  columns: number;
  truncatedRows: boolean;
  truncatedColumns: boolean;
}

/** Quoted CSV/TSV with bounded retained rows and cells. A byte-cut final record is omitted. */
export function parseDelimited(text: string, delimiter: "," | "\t", maxRows: number, maxColumns: number, partial = false): DelimitedGrid {
  const grid: DelimitedGrid = { rows: [], columns: 0, truncatedRows: false, truncatedColumns: false };
  let row: string[] = [], field = "", column = 0;
  let quoted = false, fieldStarted = false, recordStarted = false;
  const endField = () => {
    if (column < maxColumns) row.push(field);
    else grid.truncatedColumns = true;
    column++;
    field = "";
    fieldStarted = false;
  };
  const endRow = () => {
    endField();
    grid.columns = Math.max(grid.columns, row.length);
    grid.rows.push(row);
    row = [];
    column = 0;
    recordStarted = false;
  };
  for (let at = text.charCodeAt(0) === 0xfeff ? 1 : 0; at < text.length; at++) {
    const ch = text[at]!;
    recordStarted = true;
    if (quoted) {
      if (ch === '"') {
        if (text[at + 1] === '"') {
          if (column < maxColumns) field += '"';
          at++;
        } else quoted = false;
      } else if (column < maxColumns) field += ch;
      continue;
    }
    if (ch === '"' && !fieldStarted) {
      quoted = true;
      fieldStarted = true;
    } else if (ch === delimiter) endField();
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[at + 1] === "\n") at++;
      endRow();
      if (grid.rows.length === maxRows) {
        grid.truncatedRows = at + 1 < text.length;
        return grid;
      }
    } else {
      fieldStarted = true;
      if (column < maxColumns) field += ch;
    }
  }
  if (recordStarted && !partial) endRow();
  return grid;
}
