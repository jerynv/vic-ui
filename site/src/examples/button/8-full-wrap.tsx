import { Button } from "vic-ui";

export const title = "Full width, with words longer than the column";
export const note = "A full button is as wide as its column and no wider: words longer than the column wrap inside it, and one line keeps the button's own height.";

export default function Example() {
  return (
    <div className="demo-stack" style={{ width: "15rem" }}>
      <Button full>Continue</Button>
      <Button full size="lg">
        Send the agreement to every owner who has joined
      </Button>
      <Button full look="line">
        Download everything this organisation holds as one file
      </Button>
    </div>
  );
}
