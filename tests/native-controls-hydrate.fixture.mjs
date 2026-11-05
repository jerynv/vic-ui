import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { NativeControlsFixture } from "./native-controls.fixture.mjs";

hydrateRoot(document.getElementById("root"), createElement(NativeControlsFixture));
