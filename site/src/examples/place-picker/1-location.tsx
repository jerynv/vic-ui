import { useState } from "react";
import { PlacePicker, type PlaceValue } from "vic-ui";

export const title = "Choose where it belongs";
export const note = "Browse a space or search its projects. The host supplies the available places and retains selection.";
const spaces = [{ id: "studio", name: "Studio", whole: true }, { id: "operations", name: "Operations", whole: false }];
const projects = [{ id: "guide", name: "Field guide", spaceId: "studio" }, { id: "planning", name: "Planning", spaceId: "operations" }];
export default function PlacePickerExample() {
  const [value, setValue] = useState<PlaceValue>({ spaceId: "studio", projectId: "guide" });
  return <PlacePicker value={value} onValueChange={setValue} spaces={spaces} projects={projects} organization aria-label="Location" label="Location" />;
}
