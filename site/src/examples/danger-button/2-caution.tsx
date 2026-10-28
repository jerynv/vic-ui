import { CautionButton } from "vic-ui";

export const title = "Caution";
export const note = "The commit of a change to terms somebody already agreed to.";

export default function Example() {
  return (
    <div className="demo-row">
      <CautionButton>Change the terms</CautionButton>
      <CautionButton disabled disabledReason="Sign the agreement first.">
        Change the terms
      </CautionButton>
    </div>
  );
}
