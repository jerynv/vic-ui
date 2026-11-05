import { createElement as h, useRef, useState } from "react";
import { Input, TextareaControl, NativeSelect, Radio, Disclosure, Skeleton } from "../dist/index.js";

export function NativeControlsFixture() {
  const email = useRef(null), notes = useRef(null), role = useRef(null), radio = useRef(null);
  const [changed, setChanged] = useState("");
  const [submitted, setSubmitted] = useState("");
  const change = event => setChanged(`${event.target.name}:${event.target.value}`);
  return h("main", { style: { width: 360, padding: 16 } },
    h("form", { id: "native-form", onSubmit(event) {
      event.preventDefault();
      setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
    } },
      h("label", { htmlFor: "email" }, "Email"),
      h(Input, { id: "email", ref: email, name: "email", type: "email", required: true, placeholder: "you@example.com", className: "consumer-input", onChange: change }),
      h("label", { htmlFor: "notes" }, "Notes"),
      h(TextareaControl, { id: "notes", ref: notes, name: "notes", rows: 3, placeholder: "Add context", onChange: change }),
      h("label", { htmlFor: "role" }, "Role"),
      h(NativeSelect, { id: "role", ref: role, name: "role", defaultValue: "reader", onChange: change },
        h("option", { value: "reader" }, "Reader"), h("option", { value: "editor" }, "Editor")),
      h("fieldset", null, h("legend", null, "Plan"),
        h("label", null, h(Radio, { id: "basic", ref: radio, name: "plan", value: "basic", defaultChecked: true, onChange: change }), "Basic"),
        h("label", null, h(Radio, { id: "advanced", name: "plan", value: "advanced", onChange: change }), "Advanced")),
      h(Input, { id: "disabled", name: "disabled", "aria-label": "Unavailable", defaultValue: "Excluded", disabled: true }),
      h("button", { type: "submit" }, "Submit")),
    ...[["email", email], ["notes", notes], ["role", role], ["radio", radio]].map(([name, ref]) => h("button", { key: name, type: "button", onClick: () => ref.current.focus() }, `Focus ${name}`)),
    h("output", { id: "changed" }, changed),
    h("output", { id: "submitted" }, submitted),
    h(Disclosure, { id: "extra", summary: "More settings" }, "Details stay native."),
    h(Skeleton, { id: "placeholder", className: "consumer-skeleton", style: { width: 80, height: 20 } }),
  );
}
