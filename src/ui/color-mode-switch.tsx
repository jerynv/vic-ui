import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "./dropdown-menu";

export type ColorMode = "light" | "dark" | "system";

/** Controlled appearance menu, composed from the same primitives as the rest of the library. */
export function ColorModeSwitch({ value, onValueChange }: { value: ColorMode; onValueChange: (value: ColorMode) => void }) {
  const Icon = value === "dark" ? MoonIcon : value === "light" ? SunIcon : MonitorIcon;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Change color theme" />}>
        <Icon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={value} onValueChange={(value) => onValueChange(value as ColorMode)}>
          <DropdownMenuRadioItem value="light" closeOnClick><SunIcon aria-hidden="true" />Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" closeOnClick><MoonIcon aria-hidden="true" />Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" closeOnClick><MonitorIcon aria-hidden="true" />System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
