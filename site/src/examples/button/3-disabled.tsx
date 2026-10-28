import { Button } from "vic-ui";

export const title = "Disabled, and disabled for a reason";
export const note = "Dimmed but readable, with a not-allowed pointer. With disabledReason it stays focusable and says why on hover and focus.";

export default function Example() {
  return (
    <div className="demo-row">
      <Button disabled>Saving</Button>
      <Button disabled disabledReason="Type the code from your email first.">
        Verify
      </Button>
      <Button look="line" disabled disabledReason="Only an owner can change the plan.">
        Change the plan
      </Button>
    </div>
  );
}
