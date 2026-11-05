import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { AccentFixture } from "./accent-button.fixture.mjs";

hydrateRoot(document.getElementById("root"), createElement(AccentFixture));
