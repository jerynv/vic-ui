import { useEffect, useState } from "react";
import { Combobox, type Option } from "vic-ui";

export const title = "Asked of a server";
export const note = "The answer arrives late and carries at most three. steady holds the list at one height while it arrives, so it never jumps.";

const EVERYBODY: Option[] = ["Ines Okafor", "Tomas Brandt", "Mei Larsen", "Rafael Duarte", "Ana Sousa"].map((name, at) => ({ value: `u${at}`, label: name }));

export default function Example() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<{ found: Option[]; more: boolean } | null>(null);
  const [chosen, setChosen] = useState<Option | null>(EVERYBODY[2]!);
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      const all = EVERYBODY.filter((one) => (one.label as string).toLowerCase().includes(query.trim().toLowerCase()));
      setAnswer({ found: all.slice(0, 3), more: all.length > 3 });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [open, query]);
  return (
    <div className="demo-stack">
      <Combobox
        label="Somebody"
        items={open ? (answer?.found ?? []) : []}
        chosenItems={chosen ? [chosen] : []}
        value={chosen?.value ?? null}
        onValueChange={(value) => setChosen(EVERYBODY.find((one) => one.value === value) ?? null)}
        query={query}
        onQueryChange={setQuery}
        filter={false}
        steady
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setAnswer(null);
        }}
        placeholder="Find somebody"
        empty={answer === null ? "Looking" : "Nobody by that name"}
        {...(answer?.more ? { footer: "Type more of a name to find somebody further down." } : {})}
      />
    </div>
  );
}
