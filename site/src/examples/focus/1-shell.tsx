import { useState } from "react";
import { FocusLayout } from "vic-ui";
import { FocusLine } from "vic-ui";
import { CodeField } from "vic-ui";
import { Button } from "vic-ui";
export const title = "A focused task";
export const note = "The host supplies branding, appearance controls and the task. No account or theme persistence is performed.";
export default function FocusExample() {
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"light" | "dark">("light");
  return <div data-mode={mode}><FocusLayout title="Verify your details" org={{ name: "Field Notes", slug: "field-notes" }}
    steps={[{ words: "Details", at: "done" }, { words: "Verify", at: "now" }, { words: "Review", at: "next" }]}
    looksOnPhone renderAppearance={() => <Button look="line" onClick={() => setMode(mode === "light" ? "dark" : "light")}>Change preview theme</Button>}
  >
    <FocusLine>Use a local demo code to try the input.</FocusLine>
    <CodeField label="Verification code" value={code} onChange={setCode} />
  </FocusLayout></div>;
}
