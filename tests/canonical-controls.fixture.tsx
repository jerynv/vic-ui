import { createRoot } from "react-dom/client";
import { Button } from "../src/components/Button";
import { Switch } from "../src/components/Switch";
import { Choice } from "../src/components/Choice";
import { Checkbox } from "../src/components/Checkbox";
import { TextField } from "../src/components/TextField";
import { Textarea } from "../src/components/Textarea";
import { NumberField } from "../src/components/NumberField";
import { SearchField } from "../src/components/SearchField";
import { SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../src/components/Sidebar";
import "../src/styles/tokens.css";
import "../src/styles/components/ui-canonical-controls.css";
import "./canonical-controls.fixture.css";
document.documentElement.dataset.mode = new URLSearchParams(location.search).get("theme") ?? "light";
function Example() {
  return <main>
    <h1>Canonical control options</h1>
    <div className="button-examples">
      <Button>Default action</Button><Button look="line" size="xs">Compact action</Button>
      <Button look="glass" size="xs">Glass action</Button>
      <Button look="glass" size="xs" square round aria-label="Round glass">+</Button>
      <Button disabled disabledReason="An owner must enable this action." aria-describedby="external">Held action</Button>
    </div>
    <p id="external">External instructions remain available.</p>
    <Switch aria-label="Held switch" checked={false} disabled disabledReason="An owner must enable this switch." aria-describedby="external" />
    <Choice chosen={false} disabled disabledReason="An owner must enable this choice." aria-describedby="external">Held chip</Choice>
    <Checkbox label="Held checkbox" disabled disabledReason="An owner must enable this checkbox." aria-describedby="external" />
    <TextField label="Held text" hint="Text hint" disabled disabledReason="Text is read only." aria-describedby="external" />
    <NumberField label="Held number" hint="Number hint" value="12" onValueChange={() => {}} disabled disabledReason="Number is read only." aria-describedby="external" />
    <SearchField label="Held search" hint="Search hint" value="query" onValueChange={() => {}} disabled disabledReason="Search is read only." aria-describedby="external" />
    <Textarea label="Limited words" maxLength={10} hint="Words hint" aria-describedby="external" />
    <Textarea label="Hidden count" maxLength={10} count={false} />
    <Textarea label="Supplied invalid state" aria-invalid="true" />
    <SidebarProvider><SidebarMenu>
      <SidebarMenuItem><SidebarMenuButton active href="#current">Current destination</SidebarMenuButton></SidebarMenuItem>
      <SidebarMenuItem><SidebarMenuButton active aria-current="step" href="#step">Current step</SidebarMenuButton></SidebarMenuItem>
    </SidebarMenu></SidebarProvider>
  </main>;
}
createRoot(document.getElementById("root")!).render(<Example />);
