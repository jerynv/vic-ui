import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { PreviewTextFixture } from "./preview-text.fixture.mjs";
hydrateRoot(document.getElementById("root"), createElement(PreviewTextFixture));
