import { createElement as h, Fragment, useState } from "react";
import { Button, ButtonLink, DangerButton, CautionButton } from "../dist/index.js";
import { Button as ComposableButton, buttonVariants } from "../dist/ui.js";

export function AccentFixture() {
  const [presses, setPresses] = useState(0);
  const press = () => setPresses(n => n + 1);
  // A section below a [data-mode] element that sets only --accent (and --accent-on) must reach
  // its accent button, as a section setting --button-accent does.
  const inner = { "--accent": "oklch(.5 .15 145)", "--accent-on": "oklch(.97 0 0)" };
  const innerReference = { "--button-accent": "oklch(.5 .15 145)", "--button-on-accent": "oklch(.97 0 0)" };
  return h(Fragment, null, h("main", { id: "accent", style: { "--button-accent": "oklch(.5 .075 240)", "--button-on-accent": "oklch(.97 0 0)" } },
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
  ), h("div", { "data-mode": "light" },
    h("section", { style: inner }, h(Button, { id: "inner", tone: "accent" }, "Inner accent")),
    h("section", { style: innerReference }, h(Button, { id: "inner-reference", tone: "accent" }, "Inner reference")),
    h("section", null, h(Button, { id: "inner-default", tone: "accent" }, "Default accent")),
  ));
}
