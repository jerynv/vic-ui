import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { ColorModeSwitch } from "vic-ui/ui";

const subscribe = () => () => {};
export function WebsiteTheme() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { theme, setTheme } = useTheme();
  const value = mounted && (theme === "light" || theme === "dark") ? theme : "system";
  return <ColorModeSwitch value={value} onValueChange={setTheme} />;
}
