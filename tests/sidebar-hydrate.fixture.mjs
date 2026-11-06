import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { SidebarFixture, SidebarOptionsFixture } from "./sidebar.fixture.mjs";

const query = new URL(location.href).searchParams;
hydrateRoot(document.getElementById("root"), query.has("options") ? createElement(SidebarOptionsFixture, { dense: query.has("dense") }) : createElement(SidebarFixture, { contained: query.has("contained"), empty: query.has("empty") }));
