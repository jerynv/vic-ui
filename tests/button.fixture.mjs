import { createElement as h, useCallback, useRef, useState } from "react";
import { Button, ButtonLink, DangerButton, IconButton } from "../dist/index.js";

export function Fixture() {
  const [presses, setPresses] = useState(0);
  const [submitted, setSubmitted] = useState("");
  const ref = useRef(null);
  const press = () => setPresses((n) => n + 1);
  // A React 19 callback ref that hands back a cleanup, on a plain button and a held one: each
  // records what it is called with, so the test can see the cleanup run in place of a null.
  const [tidy, setTidy] = useState(true);
  const record = useCallback((element) => {
    const calls = (globalThis.tidyCalls ??= []);
    calls.push(element ? `attach ${element.textContent}` : "null");
    return element ? () => calls.push(`cleanup ${element.textContent}`) : undefined;
  }, []);
  return h("form", { onSubmit: (event) => {
    event.preventDefault();
    setSubmitted(new FormData(event.currentTarget, event.nativeEvent.submitter).get("action"));
  } },
    h(Button, { ref, onClick: press }, "Count"),
    h(Button, { disabled: true, disabledReason: "Choose a file first", onClick: press }, "Held"),
    h(Button, { disabled: true, onClick: press }, "Disabled"),
    h(Button, { busy: true, onClick: press }, "Saving"),
    h(DangerButton, { type: "submit", name: "action", value: "remove" }, "Remove"),
    h(IconButton, { label: "Theme", icon: h("svg", { "aria-hidden": true }), onClick: press }),
    h(ButtonLink, { href: "#destination", look: "line" }, "Destination"),
    h("output", { id: "presses" }, presses),
    h("output", { id: "submitted" }, submitted),
    h("button", { type: "button", onClick: () => ref.current.focus() }, "Focus count"),
    tidy ? h(Button, { ref: record, look: "line" }, "Tidy") : null,
    tidy ? h(Button, { ref: record, look: "line", disabled: true, disabledReason: "Not yet" }, "Tidy held") : null,
    h("button", { type: "button", onClick: () => setTidy(false) }, "Remove tidy"),
  );
}
