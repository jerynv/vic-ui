// Adapted from canonical V-Client 555625f4; source transfer authorized by the owner.
import { useId, type ReactNode } from "react";

/** One way the app may look, as a picture of it: the device's own choice, light, or dark. */
export type ModeChoiceValue = "system" | "light" | "dark";

/** A small window of the app in one mode: its rail, a heading and a few lines, in that mode's own colours. */
function Window(props: { mode: "light" | "dark" }) {
  return (
    <span className="ui-mode-window" data-mode={props.mode} aria-hidden="true">
      <span className="ui-mode-rail">
        <i />
        <i />
        <i />
      </span>
      <span className="ui-mode-page">
        <b />
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}

/**
 * How the app looks, chosen from pictures of it, as GitHub's and Linear's appearance settings let
 * somebody choose: a small window of the app in light, in dark, and split corner to corner for
 * matching the device, each in that mode's own colours (`data-mode` sets them, whatever mode the page
 * is in), its name under it and the one chosen ringed in ink. Native radios under the pictures, so
 * the arrows move between them and a screen reader hears a choice of three.
 */
export function ModeChoice(props: { value: ModeChoiceValue; onChange: (value: ModeChoiceValue) => void; labels?: Partial<Record<ModeChoiceValue, ReactNode>>; "aria-label"?: string }) {
  const name = useId();
  const words: Record<ModeChoiceValue, ReactNode> = { system: "Match this device", light: "Light", dark: "Dark", ...props.labels };
  return (
    <div role="radiogroup" aria-label={props["aria-label"] ?? "Appearance"} className="ui-mode-choice">
      {(["system", "light", "dark"] as const).map((mode) => (
        <label key={mode} className="ui-mode-option" data-chosen={props.value === mode ? "" : undefined}>
          <input type="radio" className="sr-only" name={name} value={mode} checked={props.value === mode} onChange={() => props.onChange(mode)} />
          <span className="ui-mode-picture">
            {mode === "system" ? (
              <>
                <Window mode="light" />
                <span className="ui-mode-half">
                  <Window mode="dark" />
                </span>
              </>
            ) : (
              <Window mode={mode} />
            )}
          </span>
          <span className="ui-mode-name">{words[mode]}</span>
        </label>
      ))}
    </div>
  );
}
