import { createElement as h, useEffect, useState } from "react";
import { Button, ColorModeSwitch, CodeSnippet, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose, InputOTP, InputOTPGroup, InputOTPSlot, Slider, Toggle, ScrollArea } from "../dist/ui.js";

export function CatalogueFixture() {
  const [mode, setMode] = useState("light");
  const [volume, setVolume] = useState(30);
  const [otp, setOtp] = useState("");
  useEffect(() => { document.documentElement.dataset.mode = mode; }, [mode]);
  return h("main", { style: { maxWidth: 600, margin: "40px auto", padding: 24, display: "grid", gap: 24 } },
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
