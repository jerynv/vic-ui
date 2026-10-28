import { Trail } from "vic-ui";

export const title = "Where a page sits";
export const note = "Each step above it a link back, then the page's own name. A long step is cut and named on hover; on a phone every step but the nearest folds into one link back. line keeps it to one line, for a bar. It takes its size from where it is set.";

export default function Example() {
  return (
    <div className="demo-stack" style={{ fontSize: "var(--text-ui)" }}>
      <Trail line heading={false} steps={[{ to: "#/trail", label: "Organisations" }, { to: "#/trail", label: "Halden Partners" }]} here="Billing" />
      <Trail heading={false} steps={[{ to: "#/trail", label: "Spaces" }, { to: "#/trail", label: "Client work" }]} here="The second phase of the warehouse fit-out, with the loading bay and the offices over it" />
      <Trail line heading={false} steps={[]} here="Leads" />
    </div>
  );
}
