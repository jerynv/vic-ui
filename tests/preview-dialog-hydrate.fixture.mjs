import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { PreviewDialogFixture } from "./preview-dialog.fixture.mjs";
hydrateRoot(document.getElementById("root"), createElement(PreviewDialogFixture));
