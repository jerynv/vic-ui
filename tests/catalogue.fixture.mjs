import { Surface, Select as NativeVicSelect, Textarea as NativeVicTextarea } from "../dist/index.js";
import { NativeSelect, NativeSelectOption, InputGroup, InputGroupInput } from "../dist/ui.js";
import { createElement as h, useEffect, useState } from "react";
import { Button, ColorModeSwitch, CodeSnippet, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose, InputOTP, InputOTPGroup, InputOTPSlot, Slider, Toggle, ScrollArea, Card, CardContent, Input, Switch, Badge, Checkbox, RadioGroup, RadioGroupItem, Tabs, TabsList, TabsTrigger, TabsContent } from "../dist/ui.js";

import { Button as OriginalButton, Card as OriginalCard, Switch as OriginalSwitch, TextField, Checkbox as OriginalCheckbox, Badge as OriginalBadge, Tabs as OriginalTabs } from "../dist/index.js";

export function CatalogueFixture() {
  const [mode, setMode] = useState("light");
  const [volume, setVolume] = useState(30);
  const [tab, setTab] = useState("one");
  const [otp, setOtp] = useState("");
  useEffect(() => { document.documentElement.dataset.mode = mode; }, [mode]);
  return h("main", { style: { maxWidth: 600, margin: "40px auto", padding: 24, display: "grid", gap: 24 } },
    h("section", { id: "surface-tests" }, ["flat", "bordered"].map(surface => h(Surface, { key: surface, surface, id: surface },
      h(TextField, { "aria-label": `${surface} name`, placeholder: "Your name" }),
      h(Input, { "aria-label": `${surface} input`, placeholder: "Your name" }),
      h(NativeVicTextarea, { label: `${surface} note`, placeholder: "Your note" }),
      h(NativeVicSelect, { label: `${surface} access`, value: "editor", items: { editor: "Can edit", viewer: "Can view" } }),
      h(NativeSelect, { "aria-label": `${surface} native select` }, h(NativeSelectOption, { value: "editor" }, "Can edit")),
      h(InputGroup, {}, h(InputGroupInput, { "aria-label": `${surface} group` })),
      h(OriginalCard, {}, "A card"),
      h(TextField, { "aria-label": `${surface} override`, surface: surface === "flat" ? "bordered" : "flat" }),
      h(TextField, { "aria-label": `${surface} invalid`, error: "Check this value" }),
      h(TextField, { "aria-label": `${surface} held`, disabled: true, disabledReason: "Read only" })
    ))),
    h("div", { id: "identity", style: { display: "grid", gap: 12 } },
      h(OriginalButton, { id: "original-button" }, "Save"), h(Button, { id: "composed-button" }, "Save"),
      h(OriginalButton, { id: "original-line", look: "line" }, "Cancel"), h(Button, { id: "composed-line", variant: "outline" }, "Cancel"),
      h(OriginalCard, { id: "original-card" }, "Details"), h(Card, { id: "composed-card" }, h(CardContent, {}, "Details")),
      h(TextField, { id: "original-field", "aria-label": "Original field" }), h(Input, { id: "composed-field", "aria-label": "Composed field" }),
      h(OriginalSwitch, { id: "original-switch", checked: true, "aria-label": "Original switch" }), h(Switch, { id: "composed-switch", defaultChecked: true, "aria-label": "Composed switch" }),
      h(OriginalBadge, { id: "original-badge" }, "Ready"), h(Badge, { id: "composed-badge" }, "Ready"),
      h(OriginalCheckbox, { id: "original-check", defaultChecked: true, "aria-label": "Original check" }), h(Checkbox, { defaultChecked: true, "aria-label": "Composed check" }),
      h(OriginalTabs, { items: [{ value: "one", label: "One" }, { value: "two", label: "Two" }], value: tab, onValueChange: setTab, "aria-label": "Original tabs" }),
      h(Tabs, { value: tab, onValueChange: setTab }, h(TabsList, { "aria-label": "Composed tabs" }, h(TabsTrigger, { value: "one" }, "One"), h(TabsTrigger, { value: "two" }, "Two")), h(TabsContent, { value: "one" }, "First panel"), h(TabsContent, { value: "two" }, "Second panel")),
      h(RadioGroup, { defaultValue: "one", "aria-label": "Radio choices" }, h(RadioGroupItem, { value: "one", "aria-label": "First choice" }), h(RadioGroupItem, { value: "two", "aria-label": "Second choice" })),
      h(Button, { render: h("a", { href: "#destination" }), nativeButton: false }, "Composed link"),
    ),
    h(ColorModeSwitch, { value: mode, onValueChange: setMode }),
    h(Slider, { "aria-label": "Volume", value: volume, onValueChange: setVolume }),
    h("output", { id: "volume" }, volume),
    h(Toggle, { "aria-label": "Bold" }, "B"),
    h(Dialog, {}, h(DialogTrigger, { render: h(Button) }, "Open dialog"), h(DialogContent, {}, h(DialogTitle, {}, "Edit project"), h(DialogDescription, {}, "Update project details."), h(Button, {}, "Save"))),
    h(Drawer, {}, h(DrawerTrigger, { render: h(Button) }, "Open drawer"), h(DrawerContent, {}, h(DrawerTitle, {}, "Project filters"), h(DrawerDescription, {}, "Choose the projects to show."), h(DrawerClose, { render: h(Button) }, "Apply filters"))),
    h(InputOTP, { maxLength: 6, "aria-label": "One-time code", value: otp, onChange: setOtp }, h(InputOTPGroup, {}, ...Array.from({ length: 6 }, (_, index) => h(InputOTPSlot, { index, key: index })))),
    h("output", { id: "otp" }, otp),
    h(ScrollArea, { style: { height: 80, width: 240 } }, ...Array.from({ length: 20 }, (_, index) => h("p", { key: index }, `Row ${index + 1}`))),
    h(CodeSnippet, { code: "const answer = 42;\n", language: "tsx", filename: "example.tsx" }),
  );
}
