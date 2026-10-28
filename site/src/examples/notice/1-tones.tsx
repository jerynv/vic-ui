import { useState } from "react";
import { Button, Notice } from "vic-ui";
import { CheckCircleIcon } from "vic-ui/icons";

export const title = "Tones, titles, actions";
export const note = "onDismiss puts it away with a press.";

export default function Example() {
  const [shown, setShown] = useState(true);
  return (
    <div className="demo-wide">
      <Notice title="Read before going on">Nothing here has a tone: the rule and the words are ink on the fields' fill.</Notice>
      <Notice tone="moving" title="Sent for signature">
        Two of three people have signed. The last one was asked yesterday.
      </Notice>
      <Notice tone="settled" icon={<CheckCircleIcon />} title="Paid">
        Invoice 1042 was paid on 12 October.
      </Notice>
      <Notice tone="caution" title="The terms change on 1 November" action={<Button look="line">Read the change</Button>}>
        Your seats stay at the price agreed until then.
      </Notice>
      <Notice tone="danger" title="That code did not match" action={<Button look="line">Send a new code</Button>}>
        Type the six digits from the latest email, or ask for another.
      </Notice>
      {shown ? (
        <Notice tone="caution" onDismiss={() => setShown(false)}>
          Words alone, with no title, that can be put away.
        </Notice>
      ) : (
        <Button look="quiet" onClick={() => setShown(true)}>
          Bring the notice back
        </Button>
      )}
    </div>
  );
}
