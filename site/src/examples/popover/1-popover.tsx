import { useState } from "react";
import { Button, Popover, Select } from "vic-ui";

export const title = "Words, and a field inside";

export default function Example() {
  const [who, setWho] = useState(false);
  const [edit, setEdit] = useState(false);
  const [role, setRole] = useState("member");
  return (
    <div className="demo-row">
      <Popover
        open={who}
        onOpenChange={setWho}
        aria-label="Who can see this"
        trigger={(t) => (
          <Button look="line" {...t}>
            Who can see this
          </Button>
        )}
      >
        <p>Everybody in Design reviews, and the two guests put in it by name.</p>
      </Popover>
      <Popover
        open={edit}
        onOpenChange={setEdit}
        aria-label="Change the role"
        trigger={(t) => (
          <Button look="line" {...t}>
            With a field inside
          </Button>
        )}
      >
        <div style={{ display: "grid", gap: "0.75rem", minWidth: "16rem" }}>
          <Select size="sm" label="Role" items={{ admin: "Admin", member: "Member", guest: "Guest" }} value={role} onValueChange={setRole} />
          <Button onClick={() => setEdit(false)}>Save</Button>
        </div>
      </Popover>
    </div>
  );
}
