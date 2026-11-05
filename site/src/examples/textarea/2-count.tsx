import { useState } from "react";
import { Textarea } from "vic-ui";
export const title = "Keep the limit, choose the count";
export const note = "count=false removes the displayed count and its announcement while keeping maxLength. Visible counts announce at 90 percent of the limit.";
export default function OptionalCount() {
  const [text, setText] = useState("A short description");
  return <div className="demo-stack">
    <Textarea label="With count" value={text} onValueChange={setText} maxLength={40} placeholder="Describe this collection" />
    <Textarea label="Without count" value={text} onValueChange={setText} maxLength={40} count={false} placeholder="Describe this collection" />
  </div>;
}
