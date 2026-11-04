import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { SidebarFixture } from "./sidebar.fixture.mjs";

const query = new URL(location.href).searchParams;
hydrateRoot(document.getElementById("root"), createElement(SidebarFixture, { contained: query.has("contained"), empty: query.has("empty") }));
