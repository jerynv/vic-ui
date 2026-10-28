import { FileCard } from "vic-ui";
import { FileDocxIcon, FileIcon, FilePdfIcon } from "vic-ui/icons";

export const title = "A file as a card";
export const note = "Opened by a press, or downloaded where only download is given. pending draws one still on its way.";

export default function Example() {
  return (
    <div className="demo-wide">
      <FileCard name="Autumn plan, budget.pdf" icon={<FilePdfIcon size={18} />} meta="PDF, 402 KB" download="#" onOpen={() => {}} />
      <FileCard name="Call notes.docx" icon={<FileDocxIcon size={18} />} meta="Word document, 37.5 KB" download="#" onOpen={() => {}} />
      <FileCard name="Archive.zip" icon={<FileIcon size={18} />} meta="File, 3.2 MB" download="#" />
      <FileCard name="Sending this one.pdf" icon={<FilePdfIcon size={18} />} meta="Sending, 1.1 MB" pending />
    </div>
  );
}
