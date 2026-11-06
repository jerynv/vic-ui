import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Fixture } from "./state-size.fixture.mjs";

createRoot(document.getElementById("root")).render(createElement(Fixture));
