import { useState } from "react";
import { Button, SlidingView, SlidingViews } from "vic-ui";

export const title = "A finder slid in over a conversation";

export default function Example() {
  const [finder, setFinder] = useState(false);
  return (
    <div className="demo-stack">
      <Button look="line" onClick={() => setFinder(!finder)}>
        {finder ? "Back to the conversation" : "Open the finder"}
      </Button>
      <div className="demo-pane">
        <SlidingViews active={finder ? "finder" : "conversation"}>
          <SlidingView value="conversation" className="demo-pane-words">
            The conversation
          </SlidingView>
          <SlidingView value="finder" className="demo-pane-words">
            The finder, slid in over it
          </SlidingView>
        </SlidingViews>
      </div>
    </div>
  );
}
