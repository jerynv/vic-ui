import { useState } from "react";
import { RadioGroup } from "vic-ui";

export const title = "Cards";

export default function Example() {
  const [mode, setMode] = useState("system");
  return (
    <RadioGroup
      legend="Theme"
      look="card"
      value={mode}
      onValueChange={setMode}
      items={[
        { value: "system", label: "Match this device", hint: "Light or dark as your device is set." },
        { value: "light", label: "Light", hint: "Ink on paper." },
        { value: "dark", label: "Dark", hint: "Paper on ink.", disabled: true, reason: "Not offered here." },
      ]}
    />
  );
}
