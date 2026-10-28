import { FileGrid, FileTile } from "vic-ui";
import { FileDocxIcon, FilePdfIcon, FileSpreadsheetIcon } from "vic-ui/icons";

export const title = "Several files as tiles";

export default function Example() {
  return (
    <FileGrid aria-label="Files">
      <FileTile name="Quarterly plan.pdf" meta="PDF, 2.4 MB" icon={<FilePdfIcon size={24} />} onOpen={() => {}} download="#" />
      <FileTile name="Minutes.docx" meta="Word document, 48 KB" icon={<FileDocxIcon size={24} />} onOpen={() => {}} />
      <FileTile name="Budget.xlsx" meta="Spreadsheet, 120 KB" icon={<FileSpreadsheetIcon size={24} />} download="#" />
      <FileTile name="Still sending.pdf" meta="Sending" icon={<FilePdfIcon size={24} />} pending />
    </FileGrid>
  );
}
