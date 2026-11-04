import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { RecipesFixture } from "./recipes.fixture.mjs";

hydrateRoot(document.getElementById("root"), createElement(RecipesFixture));
