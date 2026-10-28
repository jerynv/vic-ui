import { DangerButton } from "vic-ui";

export const title = "Danger";
export const note = "Filled is the commit of what removes or ends. Line is the way in to it, quiet a row's own Void.";

export default function Example() {
  return (
    <div className="demo-row">
      <DangerButton>Delete it</DangerButton>
      <DangerButton look="line">Delete the account</DangerButton>
      <DangerButton look="quiet">Void</DangerButton>
      <DangerButton disabled disabledReason="Only an owner deletes it.">
        Delete it
      </DangerButton>
      <DangerButton look="line" disabled>
        Delete the account
      </DangerButton>
    </div>
  );
}
