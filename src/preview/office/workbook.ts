/** Stored-cell extraction adapted from V-Client TableView.tsx at 2f2713d8. */
import { elements, relationships, relId, stringBudget, xml, type OfficeArchive } from "./xml";
export interface SheetGrid { name: string; rows: string[][]; columns: number; totalRows: number; totalColumns: number }
export interface Workbook { sheets: SheetGrid[]; totalSheets: number }
export const WORKBOOK_LIMITS = Object.freeze({ maxSheets: 32, maxRows: 1000, maxColumns: 60, maxCells: 50_000, maxStrings: 20_000, maxCharacters: 1_000_000 });
function integer(value: string, limit: number): number {
  if (!/^\d+$/.test(value)) throw new Error("An Office cell reference is invalid.");
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1 || number > limit) throw new Error("An Office cell reference exceeds the worksheet limits.");
  return number;
}
function columnIndex(value: string): number {
  if (!/^[A-Z]{1,3}$/i.test(value)) throw new Error("An Office column reference is invalid.");
  let column = 0;
  for (const char of value.toUpperCase()) column = column * 26 + char.charCodeAt(0) - 64;
  if (column > 16384) throw new Error("An Office column reference exceeds the worksheet limits.");
  return column - 1;
}
export function columnLabel(index: number): string {
  let value = index + 1, result = "";
  while (value > 0) { value--; result = String.fromCharCode(65 + value % 26) + result; value = Math.floor(value / 26); }
  return result;
}
export function readWorkbook(archive: OfficeArchive, limits: { rows: number; columns: number; sheets: number }): Workbook {
  const workbook = xml(archive, "xl/workbook.xml")!;
  if (workbook.documentElement.localName !== "workbook") throw new Error("This archive does not contain an XLSX workbook.");
  const sheetNodes = elements(workbook, "sheet");
  if (!sheetNodes.length || sheetNodes.length > WORKBOOK_LIMITS.maxSheets) throw new Error("Workbooks must contain between 1 and 32 sheets for preview.");
  const rels = relationships(archive, "xl/workbook.xml"), budget = { characters: 0 };
  const shared = xml(archive, "xl/sharedStrings.xml", true), sharedNodes = shared ? elements(shared, "si") : [];
  if (sharedNodes.length > WORKBOOK_LIMITS.maxStrings) throw new Error("The workbook exceeds the 20,000 shared-string budget.");
  const strings = sharedNodes.map(node => stringBudget(elements(node, "t").filter(t => t.parentElement?.localName !== "rPh").map(t => t.textContent ?? "").join(""), budget));
  const cellBudget = { characters: 0 };
  let cellCount = 0;
  const sheets = sheetNodes.slice(0, limits.sheets).map((sheet, sheetIndex) => {
    const id = relId(sheet), part = id ? rels.get(id) : undefined;
    if (!part || !part.startsWith("xl/")) throw new Error("A workbook sheet has no supported local relationship.");
    const doc = xml(archive, part)!;
    if (doc.documentElement.localName !== "worksheet") throw new Error("Only stored worksheet cells can be previewed.");
    const rows: string[][] = [], rowIds = new Set<number>();
    let totalRows = 0, totalColumns = 0;
    for (const row of elements(doc, "row")) {
      const rowNumber = integer(row.getAttribute("r") ?? String(totalRows + 1), 1_048_576), index = rowNumber - 1;
      if (rowIds.has(rowNumber)) throw new Error("A worksheet repeats a row index.");
      rowIds.add(rowNumber); totalRows = Math.max(totalRows, rowNumber);
      const cells: string[] = [], used = new Set<number>();
      let nextColumn = 0;
      for (const cell of Array.from(row.children).filter(child => child.localName === "c")) {
        if (++cellCount > WORKBOOK_LIMITS.maxCells) throw new Error("The workbook exceeds the 50,000 parsed-cell budget.");
        const reference = cell.getAttribute("r"), match = reference?.match(/^([A-Z]{1,3})([1-9]\d*)$/i);
        if (reference && (!match || integer(match[2]!, 1_048_576) !== rowNumber)) throw new Error("A cell points outside its worksheet row.");
        const column = match ? columnIndex(match[1]!) : nextColumn;
        if (column >= 16384 || used.has(column)) throw new Error("A worksheet repeats or exceeds a column index.");
        used.add(column); nextColumn = column + 1; totalColumns = Math.max(totalColumns, nextColumn);
        const type = cell.getAttribute("t"), value = elements(cell, "v")[0]?.textContent ?? "";
        let shown = value;
        if (type === "s") {
          const number = /^\d+$/.test(value) ? Number(value) : -1;
          if (!Number.isSafeInteger(number) || number < 0 || number >= strings.length) throw new Error("A worksheet refers to a missing shared string.");
          shown = strings[number]!;
        } else if (type === "inlineStr") shown = elements(cell, "t").map(t => t.textContent ?? "").join("");
        else if (type === "b") shown = value === "1" ? "TRUE" : value === "0" ? "FALSE" : value;
        else if (value === "" && elements(cell, "f").length) shown = "Not calculated";
        stringBudget(shown, cellBudget);
        if (index < limits.rows && column < limits.columns) cells[column] = shown;
      }
      if (index < limits.rows) rows[index] = cells;
    }
    const columns = Math.min(totalColumns, limits.columns);
    const name = stringBudget(sheet.getAttribute("name") ?? `Sheet ${sheetIndex + 1}`, budget);
    return { name, rows: Array.from({ length: Math.min(totalRows, limits.rows) }, (_, row) => Array.from({ length: columns }, (_, column) => rows[row]?.[column] ?? "")), columns, totalRows, totalColumns };
  });
  return { sheets, totalSheets: sheetNodes.length };
}
