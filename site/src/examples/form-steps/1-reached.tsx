import { useState } from "react";
import { FormSteps } from "vic-ui";
import { Button } from "vic-ui";
const steps = [{ value: "name", label: "Your name" }, { value: "details", label: "Details" }, { value: "review", label: "Review" }] as const;
type Step = typeof steps[number]["value"];
export const title = "Reached steps stay editable";
export const note = "The host controls the current and reached steps. Upcoming steps describe why they cannot be selected.";
export default function FormStepsExample() {
  const [current, setCurrent] = useState<Step>("name");
  const [reached, setReached] = useState<ReadonlySet<Step>>(new Set(["name"]));
  return <div><FormSteps steps={steps} current={current} reached={reached} onChoose={setCurrent} />
    <Button look="line" onClick={() => { const at = steps.findIndex(step => step.value === current); const next = steps[(at + 1) % steps.length]!; setReached(new Set([...reached, next.value])); setCurrent(next.value); }}>Next demo step</Button>
    <Button look="quiet" onClick={() => { setCurrent("name"); setReached(new Set(["name"])); }}>Reset</Button>
  </div>;
}
