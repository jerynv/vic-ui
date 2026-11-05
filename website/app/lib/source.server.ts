import { loader } from "fumadocs-core/source";
import { docs } from "./source";
import { canonicalDocPath } from "./component-families";

const input = docs.toFumadocsSource();
input.files = input.files.filter(file => {
  const path = file.path.replace(/\.mdx$/, "");
  return canonicalDocPath(path) === path;
});
// Filter before building the source so navigation and search share the same families.
export const source = loader({
  source: input, baseUrl: "/docs",
  pageTree: {
    sort: { by: "name", locales: "en", options: { sensitivity: "base" } },
  },
});
