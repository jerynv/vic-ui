import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { Slider } from "../src/components/Slider";
import { SettingsSection, SettingsGroup, SettingsRow, SettingsLayout } from "../src/components/Settings";
import { Sidebar, SidebarHeader, SidebarProvider, useSidebar } from "../src/components/Sidebar";
import { Button } from "../src/components/Button";
import "../src/index.css";
import "../src/styles/components/ui-slider.css";
import "../src/styles/components/ui-settings.css";
import "./controls-layout.fixture.css";

declare global { interface Window { touchCommits: number[]; observer: { mounts: number; unmounts: number; active: number; received: number }; } }
window.touchCommits = [];
window.observer = { mounts: 0, unmounts: 0, active: 0, received: 0 };
function ConversationObservers() {
  const { isMobile, state } = useSidebar();
  useEffect(() => {
    window.observer.mounts++;
    window.observer.active++;
    const receive = () => { window.observer.received++; };
    window.addEventListener("conversation-update", receive);
    return () => {
      window.observer.unmounts++;
      window.observer.active--;
      window.removeEventListener("conversation-update", receive);
    };
  }, []);
  useEffect(() => { document.body.dataset.sidebarState = `${isMobile ? "mobile" : "desktop"}-${state}`; }, [isMobile, state]);
  return null;
}
function SidebarMain() {
  const { toggleSidebar } = useSidebar();
  return <main><Button onClick={toggleSidebar}>Toggle navigation</Button><input aria-label="Background" /></main>;
}
function SidebarExample() {
  return <SidebarProvider style={{ "--sidebar-width": "200px" } as React.CSSProperties}>
    <ConversationObservers />
    <Sidebar aria-label="Project navigation"><SidebarHeader>Project</SidebarHeader><button>First page</button><button>Last page</button></Sidebar>
    <SidebarMain />
  </SidebarProvider>;
}
function GridExample() {
  const sectionHeading = useRef<HTMLHeadingElement>(null);
  const groupHeading = useRef<HTMLHeadingElement>(null);
  const [changed, setChanged] = useState<number | null>(null);
  const [committed, setCommitted] = useState<number | null>(null);
  return <form id="grid-form">
    <SettingsSection title="Focusable section" titleId="section-title" headingLevel={3} headingProps={{ id: "ignored-title", tabIndex: -1, ref: sectionHeading, className: "host-heading" }}>
      <button type="button" onClick={() => sectionHeading.current?.focus()}>Go to section</button>
      <SettingsGroup title="Focusable group" headingProps={{ id: "group-title", tabIndex: -1, ref: groupHeading }}>
        <button type="button" onClick={() => groupHeading.current?.focus()}>Go to group</button>
      </SettingsGroup>
    </SettingsSection>
    <Slider label="Uneven maximum" name="uneven" defaultValue={6} min={0} max={10} step={3} valueText={v => `${v} units`} onValueChange={setChanged} onValueCommitted={setCommitted} />
    <Slider label="Off-grid initial" name="initial" defaultValue={32} step={5} />
    <Slider label="Off-grid controlled" name="controlled" value={32} step={5} />
    <output data-testid="grid-change">{changed}</output><output data-testid="grid-commit">{committed}</output>
  </form>;
}
function ControlsExample() {
  const [value, setValue] = useState(50);
  const [committed, setCommitted] = useState(50);
  const [request, setRequest] = useState(50);
  const [disabled, setDisabled] = useState(true);
  const sliderRef = useRef<HTMLInputElement>(null);
  return <main className="fixture-main">
    <h1>Settings</h1>
    <p>Local component examples. Changes affect this preview only.</p>
    <SettingsLayout navigation={<><a href="#appearance" aria-current="page">Appearance</a><a href="#advanced">Advanced</a></>}
      actions={<><Button look="line" onClick={() => { setValue(50); sliderRef.current?.focus(); }}>Reset appearance</Button><Button look="quiet">Done</Button></>}>
      <SettingsSection id="appearance" title="Appearance" description="Adjust the reading experience." actions={<Button look="quiet" onClick={() => setDisabled(!disabled)}>Toggle disabled</Button>}>
        <SettingsGroup title="Reading" description="Changes apply as you adjust each control.">
          <SettingsRow label="Text size" labelId="text-size" description="Use arrows for small changes or Page Up and Page Down for larger ones." descriptionId="size-description">
            <Slider ref={sliderRef} aria-labelledby="text-size" aria-describedby="size-description" value={value} onValueChange={setValue} onValueCommitted={next => { setCommitted(next); window.touchCommits.push(next); }} min={0} max={100} step={5} valueText={(v) => `${v} percent`} name="text-size" />
            <output data-testid="value">{value}%</output><output className="sr-only" data-testid="committed">{committed}</output>
          </SettingsRow>
          <SettingsRow label="Line spacing" labelId="line-spacing" description="An uncontrolled fractional value.">
            <Slider aria-labelledby="line-spacing" defaultValue={1} min={0.25} max={2} step={0.25} largeStep={0.5} valueText={(v) => `${v} lines`} />
          </SettingsRow>
          <SettingsRow label="Color position" labelId="color-position">
            <Slider aria-labelledby="color-position" defaultValue={180} max={360} trackStyle={{ background: "linear-gradient(to right, var(--tone-danger-ink), var(--tone-caution-ink), var(--tone-settled-ink), var(--tone-moving-ink))" }} />
          </SettingsRow>
          <SettingsRow label="Right to left" labelId="rtl-label"><Slider dir="rtl" aria-labelledby="rtl-label" defaultValue={30} step={5} /></SettingsRow>
        </SettingsGroup>
        <SettingsGroup title="Availability" surface="flat">
          <SettingsRow label="Unavailable control" labelId="disabled-label" description="Enable it with Toggle disabled."><Slider aria-labelledby="disabled-label" defaultValue={40} disabled={disabled} /></SettingsRow>
          <SettingsRow label="Host controlled" labelId="refused-label" description="This example records requests and keeps its value at 50."><Slider aria-labelledby="refused-label" value={50} onValueChange={setRequest} /><output data-testid="requested">{request}</output></SettingsRow>
          <SettingsRow label="Jump to position" labelId="jump-label"><Slider aria-labelledby="jump-label" defaultValue={20} trackPress="jump" /></SettingsRow>
        </SettingsGroup>
      </SettingsSection>
      <SettingsSection id="advanced" title="Advanced" description="Long labels and descriptions wrap within the available space.">
        <SettingsGroup title="Reading details" surface="flat">
          <SettingsRow label="A longer preference label that should stay readable in a narrow settings panel" htmlFor="reading-notes" description="This intentionally long description verifies wrapping without clipping words or forcing the page to scroll horizontally." stacked>
            <textarea id="reading-notes" defaultValue="Personal reading notes" />
          </SettingsRow>
        </SettingsGroup>
      </SettingsSection>
    </SettingsLayout>
  </main>;
}
const query = new URLSearchParams(location.search);
document.documentElement.dataset.mode = query.get("theme") ?? "light";
if (query.has("narrow")) document.documentElement.dataset.narrow = "";
createRoot(document.getElementById("root")!).render(query.has("sidebar") ? <SidebarExample /> : query.has("grid") ? <GridExample /> : query.has("standalone") ? <form id="preferences">
  <p id="external-hint">External description.</p>
  <Slider label="Offset" hint="One tenth per step." aria-describedby="external-hint" min={-1.5} max={1.5} step={0.1} name="offset" valueText="Offset units" />
  <DirectionProvider direction="rtl"><Slider aria-label="Inherited direction" defaultValue={50} /></DirectionProvider>
</form> : <ControlsExample />);
