import { useId, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSlot, Label, Button } from "vic-ui/ui";

export default function InputOTPDemo() {
  const id = useId();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  return <div className="grid min-w-0 gap-3">
    <Label htmlFor={id}>Verification code</Label>
    <InputOTP id={id} maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={code}
      aria-invalid={error || undefined} aria-describedby={`${id}-help`}
      onChange={value => { setCode(value); setError(false); }}>
      <InputOTPGroup>{Array.from({ length: 6 }, (_, index) => <InputOTPSlot key={index} index={index} />)}</InputOTPGroup>
    </InputOTP>
    <p id={`${id}-help`} className="text-sm text-muted-foreground" role="status">
      {error ? "That code has expired. Request a new one." : code.length === 6 ? "All six digits entered." : "Enter or paste a six-digit code."}
    </p>
    <Button variant="outline" onClick={() => setError(current => !current)}>{error ? "Clear error" : "Preview error state"}</Button>
  </div>;
}
