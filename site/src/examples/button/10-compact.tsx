import { Button, ButtonLink } from "vic-ui";
export const title = "Compact and glass looks";
export const note = "The root API keeps ink as its default. xs and glass are explicit options for compact actions and existing surfaces.";
export default function CompactButtons() {
  return <div className="demo-row"><Button size="xs">Save</Button><Button look="line" size="xs">Edit</Button>
    <Button look="glass">Open details</Button><ButtonLink href="#usage" look="line" size="xs">Usage</ButtonLink></div>;
}
