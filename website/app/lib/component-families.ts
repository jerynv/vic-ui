// Documentation aliases only. Both public component APIs remain exported.
export const componentAliases: Record<string, string> = {
  "avatar-stack": "avatar",
  "command-palette": "command",
  "code-field": "input-otp",
  menu: "dropdown-menu",
  notice: "alert",
  radio: "radio-group",
  "text-field": "input",
  trail: "breadcrumb",
};

export function canonicalComponentId(id: string) { return componentAliases[id] ?? id; }
export function canonicalDocPath(path: string) {
  return path.replace(/^components\/([^/]+)$/, (_, id: string) => `components/${canonicalComponentId(id)}`);
}
