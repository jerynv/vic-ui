import { useState } from "react";
import { Tabs } from "vic-ui";

export const title = "The indicator in the accent";
export const note = "tone=\"accent\" draws the chosen tab's indicator in the brand colour and its words on it. A look for a product's own switcher; the row still says no state.";

export default function Example() {
  const [mode, setMode] = useState("chat");
  return (
    <div className="demo-stack">
      <Tabs aria-label="Mode" tone="accent" items={{ chat: "Chat", write: "Write", code: "Code" }} value={mode} onValueChange={setMode} />
      <Tabs aria-label="Mode, dense" tone="accent" size="sm" items={{ chat: "Chat", write: "Write", code: "Code" }} value={mode} onValueChange={setMode} />
    </div>
  );
}
