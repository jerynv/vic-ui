import { Problem } from "vic-ui";

export const title = "A refusal on a line of its own";
export const note = "The words in the danger ink at the working size, with no box, announced as they arrive. It says what to do next. A refusal at a dialog's foot is FootProblem; one too long for a line is a danger Notice.";

export default function Example() {
  return (
    <div className="demo-stack">
      <Problem>That code did not work. Ask for another and type the newest.</Problem>
      <p className="demo-words" style={{ margin: 0, color: "var(--fg)" }}>
        Saved with one change left out: <Problem as="span">the address is already on the list.</Problem>
      </p>
    </div>
  );
}
