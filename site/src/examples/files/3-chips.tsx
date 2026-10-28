import { FileChip } from "vic-ui";
import { FilePdfIcon } from "vic-ui/icons";

export const title = "A chip for a file being sent";

export default function Example() {
  return (
    <div className="demo-row">
      <FileChip name="Quarterly plan.pdf" size="1.2 MB" icon={<FilePdfIcon size={16} />} onRemove={() => {}} />
      <FileChip name="A very long name for a file that does not fit.pdf" size="8.9 MB" icon={<FilePdfIcon size={16} />} onRemove={() => {}} />
      <FileChip name="Quarterly plan.pdf" size="1.2 MB" icon={<FilePdfIcon size={16} />} sending progress={0.4} />
      <FileChip name="Quarterly plan.pdf" size="1.2 MB" icon={<FilePdfIcon size={16} />} sending />
    </div>
  );
}
