import { useState } from "react";
import { Accordion, AccordionItem } from "vic-ui";

export const title = "One open at a time";
export const note = "The arrow keys, Home and End move between heads. A held section says why.";

export default function Example() {
  const [open, setOpen] = useState<string[]>(["what"]);
  return (
    <div className="demo-wide">
      <Accordion value={open} onValueChange={setOpen}>
        <AccordionItem value="what" title="What is a seat?">
          One person who signs in, a member or a guest.
        </AccordionItem>
        <AccordionItem value="when" title="When is an invoice raised?">
          On the first day of each period, for the seats held that day.
        </AccordionItem>
        <AccordionItem value="held" title="Exports" disabledReason="Only an owner takes the export.">
          Never shown.
        </AccordionItem>
        <AccordionItem value="off" title="Disabled with no reason" disabled>
          Never shown.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
