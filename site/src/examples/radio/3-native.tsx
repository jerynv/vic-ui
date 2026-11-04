import { useId } from "react";
import { Radio } from "vic-ui";
export const title = "Custom labelled layout";
export default function Example() {
  const name = useId();
  return <fieldset className="demo-stack"><legend>Study mode</legend><label><Radio name={name} value="review" defaultChecked /> Review</label><label><Radio name={name} value="quiz" /> Quiz</label></fieldset>;
}
