import { useId } from "react";
import { Input, TextareaControl } from "vic-ui";
export const title = "Caller-owned labels and hints";
export default function Example() {
  const id = useId();
  return <div className="demo-stack"><label htmlFor={`${id}-name`}>Name</label><Input id={`${id}-name`} required placeholder="Your name" aria-describedby={`${id}-hint`} /><p id={`${id}-hint`}>Used on your profile.</p><label htmlFor={`${id}-note`}>Note</label><TextareaControl id={`${id}-note`} rows={3} defaultValue="A draft you can edit." /><Input aria-label="Unavailable field" disabled value="Unavailable" /></div>;
}
