import { Button, Spinner } from "vic-ui";

export const title = "Sizes, beside words, in a button";

export default function Example() {
  return (
    <div className="demo-row">
      <Spinner label="Loading" />
      <Spinner size={20} label="Loading" />
      <span className="demo-row">
        <Spinner size={14} />
        Saving the recording
      </span>
      <Button disabled icon={<Spinner size={14} />}>
        Sending
      </Button>
    </div>
  );
}
