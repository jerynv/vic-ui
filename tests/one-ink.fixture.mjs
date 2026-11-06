import { createElement as h, useState } from "react";
import { Button, IconButton } from "../dist/index.js";
import { Button as ComposableButton } from "../dist/ui.js";

// Three landmarks for the one-ink-button check. The first holds two ink buttons and so warns
// once, naming both, and stays at one warning when a third mounts later. The second holds one
// ink button beside a line one, a quiet icon button and an ink one inside a dialog, which is
// its own surface. The third holds an ink button and a second one passed `allowSecond`. Two
// ink buttons outside every landmark are not counted. The last two hold the composable
// `vic-ui/ui` Button, whose `variant="default"` is ink: the fourth holds two, one passed
// `allowSecond`, and is quiet; the fifth holds one beside a root ink button and warns.
export function Fixture() {
  const [more, setMore] = useState(false);
  return h("div", {},
    h("main", { id: "first" },
      h(Button, {}, "Save the draft"),
      h(Button, { look: "ink" }, "Publish"),
      more ? h(Button, { look: "ink" }, "Publish again") : null,
      h(Button, { look: "line", onClick: () => setMore(true) }, "Add another"),
    ),
    h("div", { role: "main", id: "second" },
      h(Button, { look: "ink" }, "Start"),
      h(Button, { look: "line" }, "Cancel"),
      h(IconButton, { look: "quiet", label: "Attach", icon: h("svg", { "aria-hidden": true }) }),
      h("div", { role: "dialog", "aria-label": "Confirm" }, h(Button, { look: "ink" }, "Confirm")),
    ),
    h("div", { role: "main", id: "third" },
      h(Button, { look: "ink" }, "Keep"),
      h(Button, { look: "ink", allowSecond: true }, "Also keep"),
    ),
    h("div", { role: "main", id: "fourth" },
      h(ComposableButton, {}, "Send"),
      h(ComposableButton, { variant: "outline" }, "Discard"),
      h(ComposableButton, { variant: "default", allowSecond: true }, "Send later"),
    ),
    h("div", { role: "main", id: "fifth" },
      h(ComposableButton, { variant: "default" }, "Reply"),
      h(Button, {}, "Reply to all"),
    ),
    h(Button, { look: "ink" }, "Outside every landmark"),
    h(Button, { look: "ink" }, "Also outside"),
  );
}
