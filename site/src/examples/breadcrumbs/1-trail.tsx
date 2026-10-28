import { Breadcrumbs } from "vic-ui";

export const title = "A trail";
export const note = "Each step a link but the last, which is the page itself. A long step is cut with an ellipsis.";

export default function Example() {
  return (
    <div className="demo-wide">
      <Breadcrumbs
        trail={[
          { to: "#/breadcrumbs", label: "Organisations" },
          { to: "#/breadcrumbs/1", label: "Halden Partners" },
          { to: "#/breadcrumbs/1/billing", label: "Billing" },
        ]}
      />
      <Breadcrumbs trail={[{ to: "#/breadcrumbs", label: "Leads" }]} />
    </div>
  );
}
