import { Kbd } from "vic-ui";

export const title = "Keys, and keys together";

export default function Example() {
  return (
    <div className="demo-row">
      <Kbd>Esc</Kbd>
      <Kbd name="Enter">{"↵"}</Kbd>
      <Kbd name="Up and down">{"↑↓"}</Kbd>
      <span>
        <Kbd name="Command">{"⌘"}</Kbd>
        <Kbd>K</Kbd>
      </span>
      <span>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </span>
    </div>
  );
}
