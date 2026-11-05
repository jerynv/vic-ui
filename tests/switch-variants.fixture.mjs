import { createElement as h, useState } from "react";
import { Switch as NativeSwitch } from "../dist/index.js";
import { Switch as ComposableSwitch } from "../dist/ui.js";

function SwitchRow({ api, Control, look }) {
  const id = `${api}-${look}`;
  const [checked, setChecked] = useState(false);
  const [changes, setChanges] = useState(0);
  const [blockedChanges, setBlockedChanges] = useState(0);
  const appearance = look === "default" ? {} : { look };
  return h("section", { style: { display: "flex", gap: 16, alignItems: "center", padding: 12 } },
    h("span", { style: { width: 160 } }, id),
    h(Control, { ...appearance, id, checked, "aria-label": id, onCheckedChange(value) { setChecked(value); setChanges(count => count + 1); } }),
    h("output", { id: `${id}-changes` }, changes),
    ...[false, true].map(value => h(Control, { ...appearance, key: String(value), id: `${id}-disabled-${value}`, checked: value, disabled: true,
      "aria-label": `${id} disabled ${value}`, onCheckedChange() { setBlockedChanges(count => count + 1); } })),
    h("output", { id: `${id}-blocked` }, blockedChanges),
  );
}

export function SwitchVariantsFixture() {
  const [heldChanges, setHeldChanges] = useState(0);
  return h("main", { style: { padding: 16 } },
    ...[["native", NativeSwitch], ["composable", ComposableSwitch]].flatMap(([api, Control]) =>
      ["flat", "rimmed", "default"].map(look => h(SwitchRow, { key: `${api}-${look}`, api, Control, look }))),
    h(NativeSwitch, { id: "held-flat", look: "flat", checked: false, disabled: true, disabledReason: "Only an owner can change this.",
      "aria-label": "Held flat", onCheckedChange() { setHeldChanges(count => count + 1); } }),
    h("output", { id: "held-changes" }, heldChanges),
  );
}
