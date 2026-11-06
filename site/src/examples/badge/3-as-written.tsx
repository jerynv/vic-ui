import { Badge } from "vic-ui";

export const title = "Words as written";
export const note = "A badge draws its words as they are written. Capitalisation is the author's: a state reads in sentence case, and a data word such as a file's kind stays as it is.";

export default function Example() {
  return (
    <div className="demo-wide">
      <div className="demo-row">
        <Badge tone="settled">Ready</Badge>
        <Badge tone="moving" soft>
          In review
        </Badge>
        <Badge>script</Badge>
        <Badge>file</Badge>
        <Badge>image/png</Badge>
      </div>
    </div>
  );
}
