import { useState } from "react";
import { Surface, Card, TextField, Select, Textarea, Button } from "vic-ui";

function SurfaceForm({ surface }: { surface: "flat" | "bordered" }) {
  const [role, setRole] = useState("editor");
  return <Surface surface={surface} className="min-w-0">
    <Card title={surface === "flat" ? "Flat" : "Bordered"} description="One API, two surface styles."
      foot={<><Button>Save changes</Button><Button look="line">Cancel</Button></>}>
      <div className="grid gap-4">
        <TextField label="Full name" placeholder="e.g. Maya Chen" />
        <Select label="Access" items={{ editor: "Can edit", viewer: "Can view" }} value={role} onValueChange={setRole} />
        <Textarea label="Note" placeholder="Add context for your team" rows={2} />
      </div>
    </Card>
  </Surface>;
}

export default function SurfacesDemo() {
  return <div className="grid w-full gap-6 md:grid-cols-2"><SurfaceForm surface="flat" /><SurfaceForm surface="bordered" /></div>;
}
