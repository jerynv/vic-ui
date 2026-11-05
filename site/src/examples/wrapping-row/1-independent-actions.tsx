import { useState } from "react";
import { WrappingRow } from "vic-ui";
import { Button } from "vic-ui";

export const title = "Several lines and separate actions";
export const note = "The caller chooses the native element, wrapping and actions. A passive row keeps its actions independent.";
export default function IndependentActions() {
  const [cancelled, setCancelled] = useState(false);
  return <ul style={{ margin: 0, padding: 0, listStyle: "none", width: "100%" }}>
    <WrappingRow as="li" style={{ flexWrap: "wrap", alignItems: "center" }}>
      <span style={{ minWidth: 0, flex: "1 1 12rem" }}><span style={{ display: "block" }}>Planning session</span><span style={{ display: "block", color: "var(--fg-subtle)" }}>{cancelled ? "The sample session was cancelled." : "Wednesday, 14:00. Details can wrap onto another line."}</span></span>
      <Button look="quiet" disabled={cancelled} onClick={() => setCancelled(true)}>Cancel</Button>
    </WrappingRow>
  </ul>;
}
