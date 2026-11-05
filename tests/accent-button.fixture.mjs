import { createElement as h, useState } from "react";
import { Button, ButtonLink, DangerButton, CautionButton } from "../dist/index.js";
import { Button as ComposableButton, buttonVariants } from "../dist/ui.js";

export function AccentFixture() {
  const [presses, setPresses] = useState(0);
  const press = () => setPresses(n => n + 1);
  return h("main", { id: "accent", style: { "--button-accent": "oklch(.5 .075 240)", "--button-on-accent": "oklch(.97 0 0)" } },
    h(Button, { id: "native", tone: "accent", onClick: press }, "Native"),
    h(ComposableButton, { id: "composable", tone: "accent", onClick: press }, "Composable"),
    h(ButtonLink, { id: "link", tone: "accent", href: "#result" }, "Link"),
    h("a", { id: "variants", href: "#result", className: buttonVariants({ tone: "accent" }) }, h("span", { className: "ui-button-face" }, "Variants")),
    h(Button, { id: "mono" }, "Monochrome"),
    h(Button, { id: "outline", tone: "accent", look: "line" }, "Outline"),
    h(Button, { id: "outline-reference", look: "line" }, "Outline reference"),
    ...[["danger", DangerButton], ["caution", CautionButton], ["destructive", ComposableButton]].flatMap(([id, Component]) => [
      h(Component, { key: id, id, tone: "accent", ...(id === "destructive" ? { variant: "destructive" } : {}) }, id),
      h(Component, { key: `${id}-reference`, id: `${id}-reference`, ...(id === "destructive" ? { variant: "destructive" } : {}) }, `${id} reference`),
    ]),
    ...[["disabled", Button, { disabled: true }], ["busy", ComposableButton, { busy: true }], ["held", Button, { disabled: true, disabledReason: "Choose a file first" }]].map(([id, Component, props]) =>
      h(Component, { key: id, id, tone: "accent", onClick: press, ...props }, id)),
    h("output", { id: "result" }, presses),
  );
}
