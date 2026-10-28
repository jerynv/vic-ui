import type { ReactNode } from "react";
import { Button, useReason } from "vic-ui";

export const title = "The reason a control is held";
export const note = "useReason gives any control what disabledReason gives the library's own: aria-disabled, focusable, and the reason as its tooltip.";

function Held(props: { reason: string; children: ReactNode }) {
  const why = useReason(props.reason);
  return (
    <>
      <Button look="line" {...why.props}>
        {props.children}
      </Button>
      {why.node}
    </>
  );
}

export default function Example() {
  return (
    <div className="demo-row">
      <Held reason="Type their email first.">Send the invitation</Held>
      <Button look="line" disabled>
        Disabled with no reason
      </Button>
    </div>
  );
}
