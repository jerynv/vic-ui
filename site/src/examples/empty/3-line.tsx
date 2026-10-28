import { EmptyLine } from "vic-ui";

export const title = "Nothing in a list";
export const note = "One quiet line where the rows would start, at a row's height and with no box. A place that holds nothing at all is an Empty.";

export default function Example() {
  return (
    <div className="demo-stack" style={{ maxWidth: "20rem" }}>
      <EmptyLine>Nothing pinned</EmptyLine>
      <EmptyLine>Nobody else is on it</EmptyLine>
    </div>
  );
}
