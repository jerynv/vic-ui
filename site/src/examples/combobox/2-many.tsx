import { useState } from "react";
import { Combobox, hueFor, type Option } from "vic-ui";

export const title = "Several, with faces and groups";
export const note = "With values, each choice is a chip in the box. Typed addresses become chips where no list is given.";

function Face(props: { name: string }) {
  const letters = props.name.split(" ").map((part) => part[0]).join("");
  return (
    <span data-hue={hueFor(props.name)} style={{ width: 20, height: 20, display: "inline-flex" }}>
      <span className="demo-face">{letters}</span>
    </span>
  );
}

const PEOPLE: Option[] = [
  ["Ines Okafor", "Owner", "In this space"],
  ["Tomas Brandt", "Member", "In this space"],
  ["Mei Larsen", "Manager", "Elsewhere"],
  ["Rafael Duarte", "Guest", "Elsewhere"],
  ["Ana Sousa", "Member", "Elsewhere"],
].map(([name, role, group], at) => ({ value: `u${at + 1}`, label: name!, hint: role, group: group!, start: <Face name={name!} /> }));

export default function Example() {
  const [people, setPeople] = useState<string[]>(["u1", "u3"]);
  const [holder, setHolder] = useState<string | null>("u2");
  const [addresses, setAddresses] = useState<string[]>(["ines@example.com"]);
  const [typed, setTyped] = useState("");
  return (
    <div className="demo-stack">
      <Combobox label="People" items={PEOPLE} values={people} onValuesChange={setPeople} placeholder="Find somebody" empty="Nobody by that name" footer="Showing the first five" />
      <Combobox label="Holder" items={PEOPLE} value={holder} onValueChange={setHolder} placeholder="Find somebody" empty="Nobody by that name" />
      <Combobox
        label="Email addresses"
        items={[]}
        values={addresses}
        onValuesChange={setAddresses}
        query={typed}
        onQueryChange={setTyped}
        filter={false}
        placeholder={addresses.length === 0 ? "Enter an email address" : ""}
        chipLabel={(address) => `Take ${address} off`}
      />
    </div>
  );
}
