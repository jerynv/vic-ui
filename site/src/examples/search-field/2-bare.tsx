import { useState } from "react";
import { SearchField } from "vic-ui";

export const title = "Bare, inside a box of its own";
export const note = "bare draws no box, for a search that is one part of a box the page draws around it. The glass, the clear and Escape are every search's.";

export default function Example() {
  const [words, setWords] = useState("");
  return (
    <div style={{ maxWidth: "24rem", padding: "0.25rem 0.5rem", borderRadius: "var(--radius-control)", boxShadow: "0 0 0 1px var(--line)" }}>
      <SearchField bare aria-label="Search calls" size="sm" placeholder="Search calls" value={words} onValueChange={setWords} />
    </div>
  );
}
