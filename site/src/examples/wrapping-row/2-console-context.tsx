import { useState } from "react";
import { WrappingRow } from "vic-ui";

export const title = "Existing console list context";
export const note = "An optional console-frame wrapper preserves the source panel, hairlines, chevrons and passive hover treatment.";
export default function ConsoleRows() {
  const [chosen, choose] = useState(false);
  return <div className="console-frame" style={{ width: "100%" }}>
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      <li><WrappingRow as="a" href="#wrapping-row-example" onClick={event => event.preventDefault()} style={{ alignItems: "center" }}><span style={{ flex: 1 }}>A full-row link</span></WrappingRow></li>
      <li><WrappingRow as="button" type="button" style={{ width: "100%", textAlign: "left" }} onClick={() => choose(!chosen)} aria-pressed={chosen}>{chosen ? "Selected sample record" : "Choose the sample record"}</WrappingRow></li>
      <WrappingRow as="li">A passive row has no automatic action.</WrappingRow>
    </ul>
  </div>;
}
