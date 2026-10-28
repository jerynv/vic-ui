import { Button, Card, DangerButton, TextField } from "vic-ui";

export const title = "Plain, flush, a form and a danger zone";
export const note = "plain puts the children in the card itself, padded, for a card that lays them out. flush gives the body no padding, for rows that run to its edges. as draws it as a section or a form. tone=\"danger\" edges it in the danger edge.";

export default function Example() {
  return (
    <div className="demo-wide">
      <Card plain as="section" aria-label="Plain">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "0.75rem" }}>
          <TextField label="First name" defaultValue="Ines" />
          <TextField label="Last name" defaultValue="Okafor" />
        </div>
      </Card>
      <Card title="Devices" flush>
        {["Safari on a Mac", "The app on an iPhone"].map((device) => (
          <div key={device} style={{ padding: "0.625rem 1rem", borderTop: "1px solid var(--line-soft)", fontSize: "var(--text-ui)" }}>
            {device}
          </div>
        ))}
      </Card>
      <Card as="form" title="Rename" description="What everybody sees it called." onSubmit={(event) => event.preventDefault()} foot={<Button type="submit">Save</Button>}>
        <TextField aria-label="Name" defaultValue="Halden Partners" />
      </Card>
      <Card tone="danger" title="Delete this organisation" description="Everything in it goes, and it cannot be taken back." actions={<DangerButton look="line">Delete</DangerButton>} />
    </div>
  );
}
