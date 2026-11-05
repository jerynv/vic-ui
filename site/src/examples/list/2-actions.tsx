import { useState } from "react";
import { RowButton, Rows } from "vic-ui";
import { PlusIcon } from "vic-ui/icons";
export const title = "Rows that act";
export const note = "RowButton keeps native button semantics; icon and face slots share the row geometry.";
export default function ActionRows() {
  const [created, setCreated] = useState(0);
  return <div className="demo-wide"><Rows>
    <li><RowButton icon={<PlusIcon size={16} />} onClick={() => setCreated(created + 1)}>New collection</RowButton></li>
    <li><RowButton icon={<PlusIcon size={16} />} disabled>Unavailable action</RowButton></li>
  </Rows><p aria-live="polite">{created} local collections created</p></div>;
}
