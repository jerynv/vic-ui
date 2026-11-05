import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { MediaPreviewFixture } from "./media-preview.fixture.mjs";
hydrateRoot(document.getElementById("root"), createElement(MediaPreviewFixture));
