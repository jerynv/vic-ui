import { TextField } from "vic-ui";

export const title = "Label, hint, suffix and states";
export const note = "A filled box with no border and no focus ring: the caret says where focus is.";

export default function Example() {
  return (
    <div className="demo-stack">
      <TextField label="Email" type="email" placeholder="Enter your email" />
      <TextField label="Its address" placeholder="Enter its address" suffix=".example.com" />
      <TextField label="Name" defaultValue="Victor Almeida" hint="The name everyone sees beside what you write." />
      <TextField label="Its address" defaultValue="Aperture!" suffix=".example.com" error="Use letters, numbers and hyphens." />
      <TextField label="Email" disabled defaultValue="owner@example.com" />
      <TextField aria-label="Dense" size="sm" placeholder="The dense height" />
    </div>
  );
}
