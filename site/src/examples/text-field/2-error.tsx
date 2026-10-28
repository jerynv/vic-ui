import { useState } from "react";
import { Button, Notice, TextField } from "vic-ui";

export const title = "An error in place, and a refusal above";
export const note = "Press Send with the field empty: the error takes the label's place and nothing below moves. A refusal too long for that line is a notice at the top of the form.";

export default function Example() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [long, setLong] = useState<string | null>(null);
  return (
    <form
      className="demo-stack"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setError(email.trim() === "" ? "Enter your email." : /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? null : "That is not an email address.");
      }}
    >
      {long ? (
        <Notice tone="danger" onDismiss={() => setLong(null)}>
          {long}
        </Notice>
      ) : null}
      <TextField
        label="Email"
        type="email"
        placeholder="Press Send with it empty"
        value={email}
        error={error}
        onChange={(event) => {
          setEmail(event.target.value);
          setError(null);
        }}
      />
      <div className="demo-row">
        <Button type="submit">Send me a code</Button>
        <Button look="line" onClick={() => setLong("Too many codes were asked for from this network in the last hour. Try again after 14:05.")}>
          A long refusal
        </Button>
      </div>
    </form>
  );
}
