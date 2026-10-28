import { useMemo, useState } from "react";
import { SearchField, Tabs, toast } from "vic-ui";
import * as ICONS from "vic-ui/icons";

type Glyph = (props: { size?: number; weight?: "regular" | "fill" }) => React.JSX.Element;
const ALL = Object.entries(ICONS).filter(([name, value]) => name.endsWith("Icon") && typeof value === "function") as Array<[string, Glyph]>;

export function Icons() {
  const [query, setQuery] = useState("");
  const [weight, setWeight] = useState<"regular" | "fill">("regular");
  const shown = useMemo(() => ALL.filter(([name]) => name.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  return (
    <article className="site-article">
      <header className="site-head">
        <h1>Icons</h1>
        <p>
          {ALL.length} icons: Tabler (MIT), one from MingCute (Apache 2.0) and three chevrons drawn for the system, copied into the package by <code>scripts/gen-icons.mjs</code> so nothing is fetched. Each takes <code>size</code> and <code>weight="fill"</code>, which draws its filled twin where one exists, and is drawn in <code>currentColor</code>. Press one to copy its import.
        </p>
      </header>
      <div className="site-tools">
        <SearchField aria-label="Find an icon" size="sm" placeholder="Find an icon" value={query} onValueChange={setQuery} />
        <Tabs aria-label="Weight" size="sm" items={{ regular: "Outline", fill: "Filled" }} value={weight} onValueChange={(value) => setWeight(value as "regular" | "fill")} />
      </div>
      {shown.length === 0 ? <p className="site-note">No icon is called that.</p> : null}
      <ul className="site-icons">
        {shown.map(([name, Glyph]) => (
          <li key={name}>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`import { ${name} } from "vic-ui/icons";`);
                  toast(`Copied the import of ${name}`, { id: "copied", tone: "settled" });
                } catch {
                  toast("This browser did not let the page copy", { tone: "danger" });
                }
              }}
            >
              <Glyph size={20} weight={weight} />
              <span>{name.replace(/Icon$/, "")}</span>
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}
