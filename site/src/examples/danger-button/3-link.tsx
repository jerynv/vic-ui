import { DangerButtonLink } from "vic-ui";

export const title = "The way in to a destructive screen";
export const note = "A link to the screen of its own where the thing is destroyed, outlined in the danger ink (line by default) or as words alone (quiet), for a row's Refund.";

export default function Example() {
  return (
    <div className="demo-row">
      <DangerButtonLink to="#/danger-button">Delete on request</DangerButtonLink>
      <DangerButtonLink look="quiet" to="#/danger-button">
        Refund
      </DangerButtonLink>
    </div>
  );
}
