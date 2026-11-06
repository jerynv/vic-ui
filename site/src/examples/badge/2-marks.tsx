import { Badge, Count } from "vic-ui";
import { CheckCircleIcon, ClockIcon, FlagIcon, LockIcon } from "vic-ui/icons";

export const title = "Icons and counts";
export const note = "Count is a number alone; label is what a screen reader hears. soft sets it on its tone's tint, for a count that asks less.";

export default function Example() {
  return (
    <div className="demo-wide">
      <div className="demo-row">
        <Badge tone="settled" icon={<CheckCircleIcon />}>
          Signed
        </Badge>
        <Badge tone="moving" icon={<ClockIcon />}>
          Due Friday
        </Badge>
        <Badge tone="danger" solid icon={<FlagIcon />}>
          Disputed
        </Badge>
        <Badge icon={<LockIcon />}>Private</Badge>
        <Badge tone="moving" count={12}>
          Open
        </Badge>
        <Badge tone="caution" solid count={3}>
          Waiting on you
        </Badge>
      </div>
      <div className="demo-row">
        <Count value={3} label="3 unread" />
        <Count value={42} label="42 unread" />
        <Count value={250} label="250 unread" />
        <Count value={7} tone="moving" label="7 open" />
        <Count value={7} tone="settled" label="7 paid" />
        <Count value={7} tone="caution" label="7 changed" />
        <Count value={7} tone="danger" label="7 past due" />
      </div>
      <div className="demo-row">
        <Count soft value={3} label="3 mentions" />
        <Count soft value={7} tone="moving" label="7 open" />
        <Count soft value={7} tone="settled" label="7 paid" />
        <Count soft value={7} tone="caution" label="7 changed" />
        <Count soft value={7} tone="danger" label="7 past due" />
      </div>
    </div>
  );
}
