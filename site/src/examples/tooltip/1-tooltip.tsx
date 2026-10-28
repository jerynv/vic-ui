import { Button, Tooltip } from "vic-ui";
import { CopyIcon, PushPinIcon } from "vic-ui/icons";

export const title = "On hover after a pause, and on focus";
export const note = "Never on load and never modal. The pause is TIP_DELAY_MS, 500ms.";

export default function Example() {
  return (
    <div className="demo-row">
      <Tooltip content="Copy link">
        <Button look="line" aria-label="Copy link" square icon={<CopyIcon size={16} />} />
      </Tooltip>
      <Tooltip content="Pin to the conversation" placement="bottom">
        <Button look="line" aria-label="Pin" square icon={<PushPinIcon size={16} />} />
      </Tooltip>
      <Tooltip content="A tooltip on words too">
        <Button look="quiet">Point at me</Button>
      </Tooltip>
    </div>
  );
}
