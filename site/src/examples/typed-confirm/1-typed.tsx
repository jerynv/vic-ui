import { useState } from "react";
import { DangerButton, TypedConfirm, typedFirst } from "vic-ui";

export const title = "Typed to confirm";
export const note = "Its label keeps two lines whatever it says, so the field never moves when the label wraps. The commit is held until the words match, and says why on hover and focus with typedFirst.";

export default function Example() {
  const [typed, setTyped] = useState("");
  const expect = "halden.example.com";
  const matches = typed.trim().toLowerCase() === expect;
  return (
    <form className="demo-stack" style={{ maxWidth: "24rem" }} onSubmit={(event) => event.preventDefault()}>
      <TypedConfirm expect={expect} value={typed} onValueChange={setTyped} />
      <div className="demo-row">
        <DangerButton type="submit" disabled={!matches} disabledReason={matches ? undefined : typedFirst(expect)}>
          Delete Halden Partners
        </DangerButton>
      </div>
    </form>
  );
}
