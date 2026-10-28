import { Badge, Button, Card } from "vic-ui";

export const title = "Lifted and recessed";
export const note = "A surface on the page has an edge and casts no shadow.";

export default function Example() {
  return (
    <div className="demo-wide">
      <Card title="Billing" description="Paid monthly, 12 seats." actions={<Badge tone="settled">Paid up</Badge>} foot={<Button look="line">Open billing</Button>}>
        The next invoice is raised on 1 November for 12 seats.
      </Card>
      <Card look="recessed" title="Recessed" description="Sunk into the page on the fields' fill.">
        A card with a head and a body and no foot.
      </Card>
      <Card>A card with a body alone.</Card>
      <Card look="recessed" title="A head alone" actions={<Button look="quiet">Edit</Button>} />
    </div>
  );
}
