import { useState } from "react";
import { Button } from "vic-ui";

export const title = "Words that act inside a sentence";
export const note = "The link look takes the sentence's own size and weight, in the strong ink and underlined, and wraps with it. Words that act on their own are quiet.";

export default function Example() {
  const [said, setSaid] = useState("Nothing pressed yet.");
  return (
    <div className="demo-stack">
      <p style={{ margin: 0, fontSize: "var(--text-read)" }}>
        The recording is kept for 30 days.{" "}
        <Button look="link" onClick={() => setSaid("Learn more")}>
          Learn more
        </Button>{" "}
        or{" "}
        <Button look="link" onClick={() => setSaid("Prove an email address")}>
          prove an email address
        </Button>{" "}
        to have it sent.
      </p>
      <span className="demo-words">{said}</span>
    </div>
  );
}
