import { TextField } from "vic-ui";

export const title = "Disabled for a reason";
export const note = "With disabled and a disabledReason the field is not natively disabled: it stays focusable, takes no words, and says why on hover and focus.";

export default function Example() {
  return (
    <div className="demo-stack">
      <TextField label="Email" defaultValue="owner@example.com" disabled disabledReason="Your address is changed from your account, not here." />
      <TextField label="Its address" defaultValue="halden" suffix=".example.com" disabled disabledReason="An address is fixed once the place is made." />
    </div>
  );
}
