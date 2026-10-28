import { useState } from "react";
import { Menu } from "vic-ui";

export const title = "At a point";
export const note = "at opens it where the pointer was, for a right press.";

export default function Example() {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const [said, setSaid] = useState("nothing yet");
  return (
    <div
      className="demo-area demo-wide"
      onContextMenu={(event) => {
        event.preventDefault();
        setPoint({ x: event.clientX, y: event.clientY });
      }}
    >
      Right press here for the menu at a point. Chosen: {said}.
      {point ? (
        <Menu
          aria-label="At a point"
          at={point}
          open
          onOpenChange={(open) => !open && setPoint(null)}
          items={[
            { label: "Copy", onSelect: () => setSaid("Copy") },
            { label: "Reply", onSelect: () => setSaid("Reply") },
          ]}
        />
      ) : null}
    </div>
  );
}
