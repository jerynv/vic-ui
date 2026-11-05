import { useState } from "react";
import { ModeChoice, type ModeChoiceValue } from "vic-ui";
export const title = "Choose an appearance";
export const note = "Native radio controls with light, dark and device previews. This example keeps its choice locally.";
export default function ModeChoiceExample() {
  const [mode, setMode] = useState<ModeChoiceValue>("system");
  return <ModeChoice value={mode} onChange={setMode} />;
}
