import { Badge, Count } from "vic-ui";

export const title = "The accent, a look";
export const note = "tone=\"accent\" draws a badge or a count in the brand colour, for a New or a Beta that says no state. It is not a fifth tone: a state stays danger, caution, settled or moving.";

export default function Example() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Badge tone="accent">New</Badge>
        <Badge tone="accent" soft>
          Beta
        </Badge>
        <Badge tone="accent" solid>
          New
        </Badge>
        <Badge tone="accent" dot>
          Preview
        </Badge>
      </div>
      <div className="demo-row">
        <span className="demo-row">
          Updates <Count tone="accent" value={3} label="3 new updates" />
        </span>
        <span className="demo-row">
          Ideas <Count tone="accent" soft value={12} label="12 new ideas" />
        </span>
      </div>
    </div>
  );
}
