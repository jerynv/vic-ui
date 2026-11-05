import { Facts } from "vic-ui";
import { ClockIcon } from "vic-ui/icons";

export const title = "A few facts";
export const note = "A description list that wraps as its column narrows. The host supplies every value.";
export default function FactsExample() {
  return <Facts aria-label="Recording details" items={[
    { label: "Recorded", value: "Tuesday, 10:30 AM" },
    { label: "Duration", value: "24 minutes", mark: <ClockIcon size={16} /> },
    { label: "Recorded by", value: "Alex Morgan" },
  ]} />;
}
