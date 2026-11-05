import { useRef, useState } from "react";
// Source imports keep this additive example runnable before package integration.
import { Slider } from "../../../../src/components/Slider";
import { SettingsGroup, SettingsLayout, SettingsRow, SettingsSection } from "../../../../src/components/Settings";
import { Button } from "../../../../src/components/Button";
import "../../../../src/styles/components/ui-slider.css";
import "../../../../src/styles/components/ui-settings.css";

export default function SettingsControlsExample() {
  const [scale, setScale] = useState(100);
  const slider = useRef<HTMLInputElement>(null);
  return <SettingsLayout
    navigation={<a href="#reading-settings" aria-current="page">Reading</a>}
    actions={<Button look="line" onClick={() => { setScale(100); slider.current?.focus(); }}>Reset reading settings</Button>}
  >
    <SettingsSection id="reading-settings" title="Reading" description="Local example preferences.">
      <SettingsGroup title="Text" surface="bordered">
        <SettingsRow label="Text size" labelId="reading-scale-label" description="Adjust the size of reading text." descriptionId="reading-scale-description">
          <Slider ref={slider} value={scale} onValueChange={setScale} min={75} max={175} step={5}
            aria-labelledby="reading-scale-label" aria-describedby="reading-scale-description" valueText={`${scale} percent`} />
          <output>{scale}%</output>
        </SettingsRow>
      </SettingsGroup>
      <SettingsGroup title="Spacing" surface="flat">
        <SettingsRow label="Line spacing" labelId="reading-spacing-label" stacked>
          <Slider aria-labelledby="reading-spacing-label" defaultValue={1.5} min={1} max={2} step={0.05} valueText={(value) => `${value} lines`} />
        </SettingsRow>
      </SettingsGroup>
    </SettingsSection>
  </SettingsLayout>;
}
