import { PIECES } from "../../../site/src/registry";
import registry from "../../../src/ui/registry.json";

export const catalogue = [...PIECES, ...registry.components.filter(component => !PIECES.some(piece => piece.id === component.id))];
