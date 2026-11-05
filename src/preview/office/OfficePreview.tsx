import { useEffect, useId, useRef, useState } from "react";
import { FilePreviewStatus } from "../../components/preview/FilePreview";
import { Tabs } from "../../components/Tabs";
import { officeLimit, OFFICE_LIMITS } from "./zip";
import { useOffice, type OfficePreviewProps } from "./useOffice";
import { columnLabel, readWorkbook, WORKBOOK_LIMITS, type Workbook } from "./workbook";
import { readSlides, SLIDE_LIMITS } from "./slides";
function useRetryFocus(status: string, retry: () => void) {
  const container = useRef<HTMLElement>(null), restore = useRef(false);
  useEffect(() => {
    const node = container.current;
    if (status !== "ready" || !restore.current || !node) return;
    if (node.ownerDocument.activeElement === node) node.querySelector<HTMLElement>('[role="tab"][aria-selected="true"], [role="region"][tabindex="0"]')?.focus({ preventScroll: true });
    restore.current = false;
  }, [status]);
  return { container, retry: () => {
    const node = container.current;
    restore.current = Boolean(node?.contains(node.ownerDocument.activeElement));
    if (restore.current) node?.focus({ preventScroll: true });
    retry();
  } };
}
export interface XlsxPreviewProps extends OfficePreviewProps { maxRows?: number; maxColumns?: number; maxSheets?: number }
export interface PptxPreviewProps extends OfficePreviewProps { maxSlides?: number }
export function XlsxPreview({ input, title, maxBytes, maxRows, maxColumns, maxSheets, className, onError }: XlsxPreviewProps) {
  const bytes = officeLimit(maxBytes, OFFICE_LIMITS.maxBytes), rows = officeLimit(maxRows, WORKBOOK_LIMITS.maxRows);
  const columns = officeLimit(maxColumns, WORKBOOK_LIMITS.maxColumns), sheets = officeLimit(maxSheets, WORKBOOK_LIMITS.maxSheets);
  const { state, retry } = useOffice(input, bytes, `${rows}:${columns}:${sheets}`, archive => readWorkbook(archive, { rows, columns, sheets }), onError);
  const focus = useRetryFocus(state.status, retry);
  return <section ref={focus.container} tabIndex={-1} className={["ui-preview-office", className].filter(Boolean).join(" ")} aria-label={title}>
    {state.status === "error" ? <FilePreviewStatus status="error" title="Spreadsheet could not be previewed" message={state.error.message} onRetry={focus.retry} />
      : state.status === "ready" ? <WorkbookView book={state.value} title={title} /> : <FilePreviewStatus status="loading" title="Loading spreadsheet" />}
  </section>;
}
function WorkbookView({ book, title }: { book: Workbook; title: string }) {
  const prefix = useId();
  const [selection, setSelection] = useState<{ book: Workbook; index: number } | null>(null);
  const index = selection?.book === book ? selection.index : 0, sheet = book.sheets[index]!;
  return <div>
    <p className="ui-preview-office-notice">Stored cell values only. Formulas are not recalculated; spreadsheet formatting is not reproduced.</p>
    <div className="ui-preview-office-tabs"><Tabs items={book.sheets.map((sheet, at) => ({ value: String(at), label: sheet.name }))} value={String(index)} onValueChange={value => setSelection({ book, index: Number(value) })} aria-label="Worksheets" idPrefix={prefix} size="sm" /></div>
    <div id={`${prefix}-${index}-panel`} role="tabpanel" aria-labelledby={`${prefix}-${index}`}>
      <div className="ui-preview-table-scroll" role="region" aria-label={`${title}: ${sheet.name}`} tabIndex={0}>
        {sheet.rows.length ? <table className="ui-preview-table" aria-label={sheet.name}>
          <thead><tr><th scope="col" className="ui-preview-table-number">Row</th>{Array.from({ length: sheet.columns }, (_, at) => <th key={at} scope="col">{columnLabel(at)}</th>)}</tr></thead>
          <tbody>{sheet.rows.map((row, at) => <tr key={at}><th scope="row" className="ui-preview-table-number">{at + 1}</th>{row.map((value, column) => <td key={column}>{value}</td>)}</tr>)}</tbody>
        </table> : <p className="ui-preview-office-notice">This worksheet has no stored cells.</p>}
      </div>
      {sheet.rows.length < sheet.totalRows || sheet.columns < sheet.totalColumns ? <p role="status" className="ui-preview-office-notice">Showing the first {sheet.rows.length} of {sheet.totalRows} rows and {sheet.columns} of {sheet.totalColumns} columns. Download the file to see the rest.</p> : null}
    </div>
    {book.sheets.length < book.totalSheets ? <p role="status" className="ui-preview-office-notice">Showing {book.sheets.length} of {book.totalSheets} worksheets.</p> : null}
  </div>;
}
export function PptxPreview({ input, title, maxBytes, maxSlides, className, onError }: PptxPreviewProps) {
  const bytes = officeLimit(maxBytes, OFFICE_LIMITS.maxBytes), slides = officeLimit(maxSlides, SLIDE_LIMITS.maxSlides);
  const { state, retry } = useOffice(input, bytes, String(slides), archive => readSlides(archive, slides), onError);
  const focus = useRetryFocus(state.status, retry);
  return <section ref={focus.container} tabIndex={-1} className={["ui-preview-office", className].filter(Boolean).join(" ")} aria-label={title}>
    {state.status === "error" ? <FilePreviewStatus status="error" title="Slide text could not be previewed" message={state.error.message} onRetry={focus.retry} />
      : state.status !== "ready" ? <FilePreviewStatus status="loading" title="Loading slide text" /> : <>
    <p className="ui-preview-office-notice">Extracted slide text only. Images, layout, animations and media are not reproduced. Download the file to see the designed slides.</p>
    <div className="ui-preview-office-slides" role="region" aria-label={`${title}: slide text`} tabIndex={0}>
      {state.value.slides.map((slide, index) => <article className="ui-preview-office-slide" key={index} aria-label={`Slide ${index + 1}`}>
        <p className="ui-preview-office-slide-number">Slide {index + 1}</p>
        {slide.title ? <h3>{slide.title}</h3> : null}
        {slide.lines.length ? <ul>{slide.lines.map((line, at) => <li key={at}>{line}</li>)}</ul> : !slide.title ? <p>No extractable text on this slide.</p> : null}
      </article>)}
    </div>
    {state.value.slides.length < state.value.totalSlides ? <p role="status" className="ui-preview-office-notice">Showing {state.value.slides.length} of {state.value.totalSlides} slides.</p> : null}
    </>}
  </section>;
}
