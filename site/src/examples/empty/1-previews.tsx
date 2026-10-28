import { Button, Empty } from "vic-ui";

export const title = "Over the shape of what is coming";
export const note = "Pointing at it brings the preview's first item up in its hue, where the first thing made will land.";

export default function Example() {
  return (
    <div className="demo-wide">
      <Empty preview="board" hue="clay" title="No requests yet" line="Each one gets a number, a state and somebody holding it." action={<Button>Ask for something</Button>} />
      <Empty preview="chat" hue="sage" title="Nowhere to talk yet" line="Make the first channel and everybody it is for can talk in it." action={<Button look="line">Make a channel</Button>} />
      <Empty size="card" preview="files" hue="butter" title="Nothing here yet" line="Only somebody who manages documents here can add to it." />
    </div>
  );
}
