import { PIECES } from "../../../site/src/registry";
import registry from "../../../src/ui/registry.json";
import { canonicalComponentId } from "./component-families";

const entries = new Map<string, { id: string; name: string; search: string }>();
for (const component of [...PIECES, ...registry.components]) {
  const id = canonicalComponentId(component.id);
  entries.set(id, { id, name: component.name, search: `${entries.get(id)?.search ?? ""} ${component.id} ${component.name}`.toLowerCase() });
}
export const catalogue = [...entries.values()].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
