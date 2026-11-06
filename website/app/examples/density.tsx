import { useState } from "react";
import { Button, Card, Row, Rows, Select, Table, Tabs, TextField } from "vic-ui";

const steps = { compact: "Compact", default: "Default", comfortable: "Comfortable" };
const people = [
  { name: "Maya Chen", role: "Owner" },
  { name: "Idris Bello", role: "Editor" },
];

export default function DensityDemo() {
  const [density, setDensity] = useState("default");
  const [access, setAccess] = useState("editor");
  return <div className="grid w-full max-w-xl gap-4">
    <Tabs aria-label="Density" items={steps} value={density} onValueChange={setDensity} size="sm" />
    <section data-density={density} data-testid="density-section">
      <Card title="Invite people" description="Every height on this card follows the section's density."
        foot={<><Button>Send invite</Button><Button look="line">Cancel</Button></>}>
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="Email" placeholder="name@example.com" />
            <Select label="Access" items={{ editor: "Can edit", viewer: "Can view" }} value={access} onValueChange={setAccess} />
          </div>
          <Rows>
            <Row mark={<span aria-hidden="true">M</span>} words="Maya Chen accepted" when="2m" />
            <Row mark={<span aria-hidden="true">I</span>} words="Idris Bello is waiting" when="1h" />
          </Rows>
          <Table aria-label="Members" columns={[{ key: "name", label: "Name" }, { key: "role", label: "Role" }]} rows={people} rowKey={row => row.name} />
        </div>
      </Card>
    </section>
  </div>;
}
