import { FocusFoot, FocusLine, FocusQuiet } from "vic-ui";
import { Button } from "vic-ui";
export const title = "Words around a form";
export const note = "Short guidance, quiet actions and a closing link share the existing type scale.";
export default function FocusLinesExample() {
  return <div>
    <FocusLine>Enter the code sent to the address you chose.</FocusLine>
    <FocusQuiet><Button look="quiet">Send another code</Button><Button look="quiet">Use another address</Button></FocusQuiet>
    <FocusFoot>Review the <a href="#usage">usage guide</a>.</FocusFoot>
  </div>;
}
