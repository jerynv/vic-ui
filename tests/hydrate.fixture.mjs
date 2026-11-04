import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { Fixture } from "./button.fixture.mjs";

hydrateRoot(document.getElementById("root"), createElement(Fixture));
