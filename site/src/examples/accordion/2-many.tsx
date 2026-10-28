import { useState } from "react";
import { Accordion, AccordionItem } from "vic-ui";

export const title = "Several open at once";

export default function Example() {
  const [open, setOpen] = useState<string[]>(["a", "b"]);
  return (
    <div className="demo-wide">
      <Accordion multiple value={open} onValueChange={setOpen}>
        <AccordionItem value="a" title="Several open at once">
          With multiple, opening one leaves the others as they were.
        </AccordionItem>
        <AccordionItem value="b" title="A second section">
          Open as well.
        </AccordionItem>
        <AccordionItem value="c" title="A third">
          Closed until pressed.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
