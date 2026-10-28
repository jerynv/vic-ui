import { Button, toast } from "vic-ui";

export const title = "Plain, toned, with an action, and staying";
export const note = "Put one Toaster in the app; toast() from anywhere. duration 0 stays until put away, and the same id replaces rather than stacks.";

export default function Example() {
  return (
    <div className="demo-row">
      <Button look="line" onClick={() => toast("Saved")}>
        Plain
      </Button>
      <Button look="line" onClick={() => toast("Request moved to done", { description: "Number 214, held by Priya Sandeep.", action: { label: "Undo", onPress: () => toast("Moved back to open") } })}>
        With an action
      </Button>
      <Button look="line" onClick={() => toast("Payment received", { tone: "settled" })}>
        Settled
      </Button>
      <Button look="line" onClick={() => toast("Invitation sent", { tone: "moving", description: "They join with a code." })}>
        Moving
      </Button>
      <Button look="line" onClick={() => toast("Recording stops in 5 minutes", { tone: "caution", description: "The month's limit is nearly reached." })}>
        Caution
      </Button>
      <Button look="line" onClick={() => toast("The file could not be uploaded", { tone: "danger", description: "It is over 25 megabytes. Choose a smaller file.", duration: 0 })}>
        Danger, stays
      </Button>
      <Button look="line" onClick={() => toast("Copied the link", { id: "copied" })}>
        Same id twice
      </Button>
    </div>
  );
}
