import { useState } from "react";
import { Button, Empty } from "vic-ui";
import { FolderIcon, MagnifyingGlassIcon, UploadIcon } from "vic-ui/icons";

export const title = "A mark on a tile, and a well for files";
export const note = "drop draws a well that takes files; dropping says something is held over it.";

export default function Example() {
  const [held, setHeld] = useState(false);
  return (
    <div className="demo-wide">
      <Empty
        drop
        dropping={held}
        hue="butter"
        icon={<UploadIcon />}
        title="Drop files here"
        line="Or upload them from this device."
        action={<Button icon={<UploadIcon size={16} />}>Upload files</Button>}
        secondary={
          <Button look="line" onClick={() => setHeld((now) => !now)}>
            {held ? "Let go" : "Hold a file over it"}
          </Button>
        }
      />
      <Empty icon={<FolderIcon />} title="Not open to you" line="A refusal or a failure keeps its mark on a tile." />
      <Empty hue="sky" icon={<MagnifyingGlassIcon />} title="No matches" line="Try fewer words." secondary={<Button look="line">Clear the search</Button>} />
      <Empty title="Words alone" />
    </div>
  );
}
