import { useEffect, useRef, useState } from "react";
import { Button, Slider, SettingsGroup, SettingsLayout, SettingsRow, SettingsSection } from "vic-ui";

export const title = "Reading settings";
export const note = "Host-owned navigation, focus and local values. Groups can be bordered or flat.";
export default function SettingsControlsExample() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [scale, setScale] = useState(100);
  const slider = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  return <SettingsLayout
    navigation={<Button look="quiet" disabled={!ready} onClick={() => heading.current?.focus()}>Go to reading</Button>}
    actions={<Button look="line" disabled={!ready} onClick={() => { setScale(100); slider.current?.focus(); }}>Reset reading settings</Button>}
  >
    <SettingsSection id="reading-settings" title="Reading" description="Local example preferences." headingProps={{ tabIndex: -1, ref: heading }}>
      <SettingsGroup title="Text" surface="bordered">
        <SettingsRow label="Text size" labelId="reading-scale-label" description="Adjust the size of reading text." descriptionId="reading-scale-description">
          <Slider disabled={!ready} ref={slider} value={scale} onValueChange={setScale} min={75} max={175} step={5}
            aria-labelledby="reading-scale-label" aria-describedby="reading-scale-description" valueText={`${scale} percent`} />
          <output>{scale}%</output>
        </SettingsRow>
      </SettingsGroup>
      <SettingsGroup title="Spacing" surface="flat">
        <SettingsRow label="Line spacing" labelId="reading-spacing-label" stacked>
          <Slider disabled={!ready} aria-labelledby="reading-spacing-label" defaultValue={1.5} min={1} max={2} step={0.05} valueText={(value) => `${value} lines`} />
        </SettingsRow>
      </SettingsGroup>
    </SettingsSection>
  </SettingsLayout>;
}
