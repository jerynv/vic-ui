import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { SwitchVariantsFixture } from "./switch-variants.fixture.mjs";

hydrateRoot(document.getElementById("root"), createElement(SwitchVariantsFixture));
