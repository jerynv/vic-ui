import { useState } from "react";
import { CursorPagination } from "vic-ui";

export const title = "A cursor through a list that is not counted";
export const note = "Each way says why it is held at an end.";

export default function Example() {
  const [cursor, setCursor] = useState(0);
  return (
    <div className="demo-wide">
      <CursorPagination
        from={cursor * 50 + 1}
        to={cursor * 50 + 50}
        noun="marks"
        hasPrevious={cursor > 0}
        hasNext={cursor < 3}
        onPrevious={() => setCursor((n) => n - 1)}
        onNext={() => setCursor((n) => n + 1)}
        previousReason="These are the newest marks"
        nextReason="These are the oldest marks"
      />
      <CursorPagination from={1} to={50} total={312} noun="rows" hasPrevious={false} hasNext onPrevious={() => {}} onNext={() => {}} />
    </div>
  );
}
