import { createElement as h } from "react";
import { createRoot } from "react-dom/client";
import { Toaster, toast } from "../dist/index.js";

createRoot(document.getElementById("root")).render(h(Toaster));
window.motionFixture = { toast, ready: true };
