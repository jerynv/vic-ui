import { useState } from "react";
import { Button, Dialog } from "vic-ui";

export const title = "Sizes, and a question";
export const note = "Small for a sentence and one choice, large for a body that scrolls inside the dialog. role alertdialog asks a question.";

export default function Example() {
  const [open, setOpen] = useState<"" | "sm" | "lg" | "ask">("");
  const close = () => setOpen("");
  return (
    <div className="demo-row">
      <Button look="line" onClick={() => setOpen("sm")}>
        Small
      </Button>
      <Button look="line" onClick={() => setOpen("lg")}>
        Large
      </Button>
      <Button look="line" onClick={() => setOpen("ask")}>
        A question and its answers
      </Button>
      <Dialog open={open === "sm"} onOpenChange={(next) => !next && close()} size="sm" title="A small dialog" description="For a sentence and one choice." foot={<Button onClick={close}>Done</Button>} />
      <Dialog open={open === "lg"} onOpenChange={(next) => !next && close()} size="lg" title="A large dialog" description="For a list that needs the room." foot={<Button onClick={close}>Done</Button>}>
        {Array.from({ length: 24 }, (_, n) => (
          <p key={n}>Row {n + 1} of a long body that scrolls inside the dialog.</p>
        ))}
      </Dialog>
      <Dialog
        open={open === "ask"}
        onOpenChange={(next) => !next && close()}
        role="alertdialog"
        size="sm"
        title="Delete this draft?"
        description="Its file is deleted with it, and nobody can get it back."
        foot={
          <>
            <Button look="line" onClick={close}>
              Keep it
            </Button>
            <Button onClick={close}>Delete</Button>
          </>
        }
      />
    </div>
  );
}
