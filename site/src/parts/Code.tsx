import { useState } from "react";
import { Button, IconButton, toast } from "vic-ui";
import { CheckIcon, CopyIcon } from "vic-ui/icons";

/** A snippet to read and copy. Long ones start folded to a few lines, opened by a press. */
export function Code(props: { code: string; fold?: boolean; label?: string }) {
  const long = props.code.split("\n").length > 14;
  const [open, setOpen] = useState(!(props.fold ?? true) || !long);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(props.code);
      setCopied(true);
      toast("Copied", { id: "copied", tone: "settled" });
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast("This browser did not let the page copy", { tone: "danger", description: "Select the code and copy it by hand." });
    }
  };
  return (
    <div className="site-code" data-open={open ? "" : undefined}>
      <pre tabIndex={0} aria-label={props.label ?? "Code"}>
        <code>{props.code}</code>
      </pre>
      <IconButton className="site-code-copy" icon={copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />} label="Copy the code" onClick={copy} />
      {long ? (
        <div className="site-code-bar">
          <Button look="quiet" size="md" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? "Fold the code" : "Show all the code"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
