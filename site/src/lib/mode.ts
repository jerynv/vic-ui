import { useEffect, useState } from "react";

export type Mode = "system" | "light" | "dark";

function stored(): Mode {
  try {
    const mode = localStorage.getItem("vic-ui:mode");
    if (mode === "light" || mode === "dark" || mode === "system") return mode;
  } catch {
    // Storage refused: follow the device.
  }
  return "system";
}

/**
 * The appearance, as `data-mode` on the root: light, dark, or the device's. Changing it turns
 * transitions off for the frame it happens in, so nothing passes through a half changed state.
 */
export function useMode(): [Mode, (mode: Mode) => void] {
  const [mode, setMode] = useState<Mode>(stored);
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-switching", "");
    root.setAttribute("data-mode", mode);
    try {
      localStorage.setItem("vic-ui:mode", mode);
    } catch {
      // Kept for this visit only.
    }
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => root.removeAttribute("data-switching")));
    return () => cancelAnimationFrame(frame);
  }, [mode]);
  return [mode, setMode];
}
