import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { OfficePreviewFixture } from "./office-preview.fixture.mjs";
hydrateRoot(document.getElementById("root"), createElement(OfficePreviewFixture, { files: window.__officeFiles }));
