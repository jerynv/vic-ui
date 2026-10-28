import { useState } from "react";
import { SearchField } from "vic-ui";

export const title = "States";

export default function Example() {
  const [search, setSearch] = useState("");
  const [dense, setDense] = useState("design");
  return (
    <div className="demo-stack">
      <SearchField label="Search" placeholder="Search places and people" value={search} onValueChange={setSearch} error={search.length === 1 ? "Type two letters or more." : undefined} />
      <SearchField aria-label="Search calls" size="sm" placeholder="Search places and people" value={dense} onValueChange={setDense} />
      <SearchField aria-label="Search" size="sm" placeholder="Search" value="" onValueChange={() => undefined} disabled />
      <SearchField aria-label="Search" size="sm" placeholder="Search" value="" onValueChange={() => undefined} disabledReason="Search opens once the export has finished." />
    </div>
  );
}
