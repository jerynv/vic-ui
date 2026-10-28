import { TimelineDivider } from "vic-ui";

export const title = "Dividers";

export default function Example() {
  return (
    <div className="demo-wide">
      <TimelineDivider>Yesterday</TimelineDivider>
      <TimelineDivider look="new">New</TimelineDivider>
    </div>
  );
}
