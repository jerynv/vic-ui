import { useState } from "react";
import { Button, Dialog } from "vic-ui";
export const title = "A right-side sheet with a nested dialog";
export const note = "Escape closes the nested dialog first. Both open states remain controlled by this example.";
export default function RightSheet() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return <><Button look="line" onClick={() => setOpen(true)}>Open report details</Button>
    <Dialog title="Report details" open={open} onOpenChange={next => { setOpen(next); if (!next) setConfirm(false); }} side="right"
      foot={<Button look="line" onClick={() => setOpen(false)}>Close details</Button>}>
      <p>Read the report details beside the page.</p>
      <Button look="line" onClick={() => setConfirm(true)}>Review a nested action</Button>
      <Dialog title="Review action" open={confirm} onOpenChange={setConfirm}
        foot={<Button look="line" onClick={() => setConfirm(false)}>Back to details</Button>}>
        <p>Press Escape to return to the details sheet.</p>
      </Dialog>
    </Dialog>
  </>;
}
