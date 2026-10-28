import { useState } from "react";
import { Combobox } from "vic-ui";

export const title = "Chips that say how they stand";
export const note = "chipEnd puts a word at a chip's end, chipTone colours a chip whose state is not fine, and chipFixed holds a chip that cannot be taken off yet: no x, and Backspace passes it by.";

const STATES: Record<string, "Sending" | "Sent" | "Not sent"> = {
  "ines@example.com": "Sent",
  "tomas@example.com": "Sending",
  "mei@example": "Not sent",
};

export default function Example() {
  const [addresses, setAddresses] = useState<string[]>(Object.keys(STATES));
  const [typed, setTyped] = useState("");
  return (
    <div className="demo-stack">
      <Combobox
        label="Send the recording to"
        items={[]}
        values={addresses}
        onValuesChange={setAddresses}
        query={typed}
        onQueryChange={setTyped}
        filter={false}
        placeholder={addresses.length === 0 ? "Enter an email address" : ""}
        chipLabel={(address) => `Take ${address} off`}
        chipEnd={(address) => STATES[address]}
        chipTone={(address) => (STATES[address] === "Not sent" ? "danger" : undefined)}
        chipFixed={(address) => STATES[address] === "Sending"}
      />
    </div>
  );
}
