import { useState } from "react";
import { Select, SelectField } from "vic-ui";

export const title = "States";
export const note = "Opens in the top layer. Type ahead to jump, the arrows to move, Enter to choose.";

export default function Example() {
  const [zone, setZone] = useState("");
  const [role, setRole] = useState("member");
  const [place, setPlace] = useState("every");
  return (
    <div className="demo-stack">
      <SelectField label="Time zone" placeholder="Choose one" value={zone} onValueChange={setZone} options={{ "America/New_York": "Eastern Time", "America/Chicago": "Central Time", "America/Denver": "Mountain Time", "America/Los_Angeles": "Pacific Time", "Europe/London": "London", "Europe/Paris": "Paris", "Asia/Tokyo": "Tokyo" }} />
      <Select label="Role" value={role} onValueChange={setRole} items={{ owner: "Owner", admin: "Admin", manager: "Manager", member: "Member", guest: "Guest" }} hint="What the software lets them do." />
      <SelectField label="People" value="11-50" onValueChange={() => undefined} options={{ "1-10": "1 to 10", "11-50": "11 to 50" }} error="Choose how many will use it." />
      <Select label="Plan" value="" items={{ "": "" }} placeholder="Loading" disabled />
      <Select label="Space" value="general" items={{ general: "General" }} disabled disabledReason="A request stays in the space it was opened in." />
      <Select aria-label="Place" size="sm" value={place} onValueChange={setPlace} items={{ every: "Every place", general: "general", design: "design" }} />
    </div>
  );
}
