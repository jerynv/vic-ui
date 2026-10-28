import { Button } from "vic-ui";
import { ArrowUpIcon, PlusIcon } from "vic-ui/icons";

export const title = "Sizes and shapes";
export const note = "Large is a form's commit. Square draws an icon alone, its words in aria-label; round makes it a circle.";

export default function Example() {
  return (
    <div className="demo-wide">
      <div className="demo-row">
        <Button size="lg">Sign in</Button>
        <Button icon={<PlusIcon size={16} />}>New request</Button>
        <Button look="line" square aria-label="Add" icon={<PlusIcon size={16} />} />
        <Button round aria-label="Send" icon={<ArrowUpIcon size={16} />} />
      </div>
      <div className="demo-stack">
        <Button size="lg" full>
          Full width, large
        </Button>
      </div>
    </div>
  );
}
