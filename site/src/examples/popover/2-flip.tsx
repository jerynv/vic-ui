import { useState } from "react";
import { Button, Popover } from "vic-ui";

export const title = "Beside its trigger, with no room beside";
export const note = "A popover set to the right goes to the left when the right has no room, and above or below when neither side has, rather than off the window. Narrow the window and open it.";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <div className="demo-row">
      <Popover
        open={open}
        onOpenChange={setOpen}
        placement="right-start"
        aria-label="About this place"
        trigger={(t) => (
          <Button look="line" {...t}>
            Open beside
          </Button>
        )}
      >
        <p style={{ width: "22rem", maxWidth: "calc(100vw - 2rem)" }}>Everybody in Design reviews can read this place, and the two guests put in it by name. Its calls are recorded only once everybody in them agrees.</p>
      </Popover>
    </div>
  );
}
