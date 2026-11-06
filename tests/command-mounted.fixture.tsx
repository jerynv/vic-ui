import { useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Command, CommandInput, CommandItem, CommandList } from "../src/ui/command";

function Mounted() {
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>("[data-case=mounted] [data-slot=command-input]")!;
      const item = document.querySelector<HTMLElement>("[data-case=mounted] [data-slot=command-item][aria-selected=true]")!;
      document.body.dataset.mountInputId = input.id;
      document.body.dataset.mountActive = input.getAttribute("aria-activedescendant") ?? "missing";
      document.body.dataset.itemId = item.id;
    });
  }, []);
  return <div data-case="mounted"><Command value="first" shouldFilter={false} onValueChange={(value) => { document.body.dataset.changedValue = value; }}>
    <CommandInput id="consumer-input" aria-activedescendant="consumer-active" value="" onValueChange={() => {}} />
    <CommandList><CommandItem value="first">First option</CommandItem><CommandItem value="second">Second option</CommandItem></CommandList>
  </Command></div>;
}

// A list that gains an item after the user has moved: the input must keep pointing at the chosen one.
function Growing({ name, defaultValue, withValues = true }: { name: string; defaultValue?: string; withValues?: boolean }) {
  const [items, setItems] = useState(["a", "b", "c", "d"]);
  return <div data-case={name}>
    <button type="button" onClick={() => setItems((all) => [...all, `e${all.length}`])}>Add to {name}</button>
    <Command {...(defaultValue ? { defaultValue } : {})}>
      <CommandInput aria-label={`Search ${name}`} />
      <CommandList>{items.map((item) => withValues
        ? <CommandItem key={item} value={item}>{`Item ${item}`}</CommandItem>
        : <CommandItem key={item}>{`Item ${item}`}</CommandItem>)}</CommandList>
    </Command>
  </div>;
}

// Controlled, with items that take their value from their words.
function ControlledWords() {
  const [value, setValue] = useState("Item b");
  return <div data-case="controlled-words">
    <button type="button" onClick={() => setValue("nothing")}>Choose nothing</button>
    <Command value={value} onValueChange={setValue}>
    <CommandInput aria-label="Search controlled words" />
    <CommandList><CommandItem>Item a</CommandItem><CommandItem>Item b</CommandItem><CommandItem>Item c</CommandItem></CommandList>
  </Command></div>;
}

createRoot(document.getElementById("root")!).render(<>
  <Mounted />
  <Growing name="uncontrolled" />
  <Growing name="default" defaultValue="b" />
  <Growing name="words" withValues={false} />
  <ControlledWords />
</>);
