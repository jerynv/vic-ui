import { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { Command, CommandInput, CommandItem, CommandList } from "../src/ui/command";

function Fixture() {
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>("[data-slot=command-input]")!;
      const item = document.querySelector<HTMLElement>("[data-slot=command-item][aria-selected=true]")!;
      document.body.dataset.mountInputId = input.id;
      document.body.dataset.mountActive = input.getAttribute("aria-activedescendant") ?? "missing";
      document.body.dataset.itemId = item.id;
    });
  }, []);
  return <Command value="first" shouldFilter={false} onValueChange={(value) => { document.body.dataset.changedValue = value; }}>
    <CommandInput id="consumer-input" aria-activedescendant="consumer-active" value="" onValueChange={() => {}} />
    <CommandList><CommandItem value="first">First option</CommandItem><CommandItem value="second">Second option</CommandItem></CommandList>
  </Command>;
}

createRoot(document.getElementById("root")!).render(<Fixture />);
