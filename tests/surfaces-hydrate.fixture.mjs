import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { SurfacesFixture } from "./surfaces.fixture.mjs";

hydrateRoot(document.getElementById("root"), createElement(SurfacesFixture));
