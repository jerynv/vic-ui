import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { CatalogueFixture } from "./catalogue.fixture.mjs";

hydrateRoot(document.getElementById("root"), createElement(CatalogueFixture));
