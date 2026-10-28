import { Button } from "vic-ui";

export const title = "Looks";
export const note = "Ink is a page's one committing action. Line stands beside it, and quiet is words that act.";

export default function Example() {
  return (
    <div className="demo-row">
      <Button>Continue</Button>
      <Button look="line">Email me the list</Button>
      <Button look="quiet">Hide</Button>
    </div>
  );
}
