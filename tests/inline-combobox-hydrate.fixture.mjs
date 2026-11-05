import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { InlineComboboxFixture } from "./inline-combobox.fixture.mjs";
hydrateRoot(document.getElementById("root"), createElement(InlineComboboxFixture));
