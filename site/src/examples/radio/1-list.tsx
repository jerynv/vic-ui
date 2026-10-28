import { useState } from "react";
import { RadioGroup } from "vic-ui";

export const title = "A list, and across a row";

export default function Example() {
  const [theme, setTheme] = useState("system");
  const [days, setDays] = useState("3");
  return (
    <div className="demo-stack">
      <RadioGroup
        legend="Theme"
        value={theme}
        onValueChange={setTheme}
        items={[
          { value: "system", label: "Follow this device" },
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
          { value: "sepia", label: "Not offered", disabled: true, reason: "Only light and dark are offered." },
        ]}
      />
      <RadioGroup legend="For how long" across value={days} onValueChange={setDays} items={["1", "3", "7"].map((n) => ({ value: n, label: n === "1" ? "1 day" : `${n} days` }))} />
    </div>
  );
}
