import { useState } from "react";
import { Select } from "vic-ui";
import { FileTextIcon, FoldersIcon, HouseIcon } from "vic-ui/icons";

export const title = "Options with marks, hints, groups and reasons";

export default function Example() {
  const [goes, setGoes] = useState("design");
  const [role, setRole] = useState("member");
  return (
    <div className="demo-stack">
      <Select
        label="Where it goes"
        value={goes}
        onValueChange={setGoes}
        items={[
          { value: "home", label: "Nowhere in particular", start: <HouseIcon size={16} /> },
          { value: "design", label: "Design", start: <FoldersIcon size={16} />, group: "Spaces" },
          { value: "brief", label: "Spring brief", start: <FileTextIcon size={16} />, group: "Projects" },
        ]}
      />
      <Select
        label="Role"
        value={role}
        onValueChange={setRole}
        items={[
          { value: "owner", label: "Owner", hint: "Everything, and the bill", disabled: true, reason: "Only another owner can make an owner." },
          { value: "admin", label: "Admin", hint: "Everything but the bill" },
          { value: "member", label: "Member" },
          { value: "guest", label: "Guest", hint: "Only the places they are put in" },
        ]}
      />
    </div>
  );
}
