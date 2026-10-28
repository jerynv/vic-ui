import { useState } from "react";
import { Button, Dialog, TextField } from "vic-ui";

export const title = "A title, a body and a foot";
export const note = "A native dialog: Escape and the backdrop close it, and focus comes back to what opened it.";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Rename the channel</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Rename the channel"
        description="Everybody in it sees the new name at once."
        foot={
          <>
            <Button look="line" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Rename</Button>
          </>
        }
      >
        <TextField label="Name" defaultValue="design-reviews" />
      </Dialog>
    </>
  );
}
