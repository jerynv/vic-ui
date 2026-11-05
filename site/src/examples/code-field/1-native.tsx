import { useState } from "react";
import { CodeField } from "vic-ui";
import { Button } from "vic-ui";
export const title = "Six native code cells";
export const note = "A single native input supports typing, paste and one-time-code autofill.";
export default function CodeFieldExample() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  return <div>
    <CodeField label="Verification code" value={value} onChange={next => { setValue(next); setError(false); }} error={error ? "That code expired" : undefined} />
    <Button look="quiet" onClick={() => setError(!error)}>Toggle error</Button>
  </div>;
}
