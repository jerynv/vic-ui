import { createRef, forwardRef, useState, type AnchorHTMLAttributes } from "react";
import {
  Action, Actions, Button, Cell, CodeField, DatePicker, Dialog, Facts,
  FocusFoot, FocusHead, FocusLayout, FocusLine, FocusMark, FocusQuiet, FormSteps,
  Grow, IconButton, ModeChoice, PaneView, PaneViews, Panel, PanelBlock, PanelField,
  PanelHead, PanelItem, PanelText, PlacePicker, Player, ProviderButtons,
  ProviderChoice, RowButton, Select, SettingsDialog, SettingsPane, SettingsSection,
  Table, Textarea, TimeField, TimePicker, Tree, WrappingRow, placeWords, treePathTo,
  type Fact, type FocusBack, type FocusLayoutProps, type FocusPlace, type FocusPulse,
  type FocusStep, type ModeChoiceValue, type PlaceProject, type PlaceSpace,
  type PlaceValue, type ProviderButtonsProps, type ProviderChoiceProps,
  type ProviderKind, type SettingsPaneSection, type TableColumn, type TableSort,
  type TimeFieldProps, type TimePickerProps, type TreeItem, type WrappingRowProps,
} from "vic-ui";

// Copied into the real tarball consumer by package.test.mjs. No source-path aliases.
type Section = "details" | "appearance";
type RecordRow = { id: string; title: string; size: number; editable: boolean };
type RouterProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: { pathname: string };
  analyticsKey: string;
  replace?: boolean;
};
const RouterLink = forwardRef<HTMLAnchorElement, RouterProps>(function RouterLink({ to, analyticsKey, replace, ...rest }, ref) {
  return <a {...rest} ref={ref} href={to.pathname} data-analytics={analyticsKey} data-replace={replace} />;
});

const facts: readonly Fact[] = [{ label: "Owner", value: "Morgan", mark: <span aria-hidden="true">M</span> }];
const tree: readonly TreeItem[] = [{ id: "team", label: "Team", icon: <span aria-hidden="true">T</span>, end: "2", children: [
  { id: "notes", label: <strong>Notes</strong>, text: "Notes" },
] }];
const path: string[] = treePathTo(tree, "notes");
const sections: readonly SettingsPaneSection<Section>[] = [
  { value: "details", label: "Details", icon: <span aria-hidden="true">D</span>, state: 1 },
  { value: "appearance", label: "Appearance" },
];
const steps: readonly FocusStep[] = [{ words: "Details", at: "now" }, { words: "Appearance", at: "next" }];
const back: FocusBack = { to: "/settings", label: "Settings", onClick: () => undefined };
const place: FocusPlace = { name: "Example workspace", slug: "example", logo: null };
const pulse: FocusPulse = { n: 1, amount: 0.7 };
const spaces: readonly PlaceSpace[] = [{ id: "design", name: "Design", whole: true }];
const projects: readonly PlaceProject[] = [{ id: "system", name: "System", spaceId: "design" }];
const providers: readonly ProviderKind[] = ["google", "microsoft"];
const columns: readonly TableColumn[] = [
  { key: "title", label: "Title", sort: true, width: "70%" },
  { key: "size", label: "Size", align: "end", wide: true },
];
const rows: readonly RecordRow[] = [{ id: "one", title: "Workspace guide", size: 24, editable: true }];
const buttonRef = createRef<HTMLButtonElement>();
const anchorRef = createRef<HTMLAnchorElement>();
const divRef = createRef<HTMLDivElement>();
const dialogRef = createRef<HTMLDialogElement>();
const headingRef = createRef<HTMLHeadingElement>();
const tableRef = createRef<HTMLTableElement>();
const textareaRef = createRef<HTMLTextAreaElement>();
const mediaRef = createRef<HTMLVideoElement & HTMLAudioElement>();
const buttonRowProps: WrappingRowProps<"button"> = { as: "button", type: "button", disabled: false, ref: buttonRef };

export function CanonicalPackageConsumer() {
  const [section, setSection] = useState<Section>("details");
  const [mode, setMode] = useState<ModeChoiceValue>("system");
  const [treeValue, setTreeValue] = useState<string | null>("notes");
  const [placeValue, setPlaceValue] = useState<PlaceValue>({ spaceId: "design", projectId: "system" });
  const [provider, setProvider] = useState<ProviderKind>("google");
  const [showNotice, setShowNotice] = useState(false);
  const [open, setOpen] = useState(false), [sheetOpen, setSheetOpen] = useState(false);
  const [changes, setChanges] = useState(0), [note, setNote] = useState("");
  const [code, setCode] = useState(""), [status, setStatus] = useState("draft");
  const [day, setDay] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(570), [exact, setExact] = useState("09:30");
  const [sort, setSort] = useState<TableSort | null>(null), [elapsed, setElapsed] = useState(0);
  const modify = () => setChanges(count => count + 1);
  const providerButtons: ProviderButtonsProps = { providers, verb: "Continue with", onChoose: setProvider, inline: { size: "sm" } };
  const providerChoice: ProviderChoiceProps = {
    ...providerButtons, onChoose: kind => { setProvider(kind); setShowNotice(true); },
    notice: <Button ref={buttonRef} onClick={() => setShowNotice(false)}>Continue</Button>,
    showNotice, noticeLabel: "Provider confirmation", noticeFocusRef: buttonRef, separator: "or use a code",
  };
  const timeField: TimeFieldProps = {
    value: minutes, onValueChange: setMinutes, min: 480, max: 1080, after: 479,
    durationLabel: duration => `${duration} minutes`, label: "Suggested time", size: "sm",
    disabled: false, disabledReason: "Choose a date first.", className: "suggested-time",
  };
  const timePicker: TimePickerProps = {
    value: exact, onValueChange: setExact, min: "08:00", max: "18:00", name: "exact-time",
    id: "exact-time", label: "Exact time", size: "sm", none: "No time", hint: "24-hour clock",
    error: null, "aria-describedby": "time-description", disabled: false, disabledReason: "Choose a date first.",
  };
  const layout: FocusLayoutProps = {
    title: "Workspace setup", children: null, back, org: place, steps, width: "list", tone: "danger",
    looksOnPhone: true, remember: "workspace-setup", className: "host-focus", brand: <strong>Host brand</strong>,
    actions: <Button look="quiet" onClick={() => setOpen(true)}>Settings</Button>,
    renderAppearance: placement => <ModeChoice aria-label={`Appearance ${placement}`} value={mode} onChange={setMode} />,
    renderArt: ({ pulse: current }) => <span>{current.n + pulse.n}: {current.amount}</span>,
  };

  return <>
    <FocusLayout {...layout}>
      <FocusLine id="time-description" role="status">The host owns these settings and their persistence.</FocusLine>
      <FocusHead title="Details" back={back} actions={<Button look="line" size="xs" onClick={modify}>Edit</Button>} />
      <FocusMark name={place.name} slug={place.slug} logo={place.logo} />
      <Facts items={facts} aria-label="Workspace facts" className="host-facts" />
      <Tree items={tree} value={treeValue} onValueChange={setTreeValue} aria-label="Folders" className="host-tree" />
      <output>{path.join(" / ")}</output>
      <Grow remember="workspace-detail" contentKey={section} className="host-grow" innerClassName="host-grow-inner">
        <PaneViews active={section} aria-label="Workspace panes">
          <PaneView value="details" aria-label="Details pane"><CodeField label="Verification code" value={code} onChange={setCode} autoFocus disabled={false} error={null} /></PaneView>
          <PaneView value="appearance"><ModeChoice value={mode} onChange={setMode} labels={{ system: "Device appearance", dark: <strong>Dark</strong> }} /></PaneView>
        </PaneViews>
      </Grow>
      <FormSteps<Section> steps={[{ value: "details", label: "Details", description: "Name the workspace", marker: "1" }, { value: "appearance", label: "Appearance", marker: "1.1" }]} current={section} reached={new Set<Section>(["details", "appearance"])} onChoose={setSection} disabled={false} />
      <ProviderButtons {...providerButtons} disabled={false} />
      <ProviderChoice {...providerChoice} />
      <FocusQuiet action="/host-owned/continue" onSubmit={event => event.preventDefault()}><Button type="submit" look="quiet">Continue with {provider}</Button></FocusQuiet>
      <FocusFoot><a href="/help">Get help</a></FocusFoot>
    </FocusLayout>

    <PanelHead actions={<Button look="line" size="xs" onClick={modify}>Edit details</Button>}>Details</PanelHead>
    <Panel as="dl" aria-label="Workspace details">
      <PanelField label="Name" note="Visible to members" error={null}>Example workspace</PanelField>
      <PanelField label="Appearance" control><ModeChoice value={mode} onChange={setMode} /></PanelField>
    </Panel>
    <Panel as="ul" aria-label="Workspace links">
      <PanelItem to="/workspace" mark={<span aria-hidden="true">W</span>} end="Open" after={<small>Host route</small>} mono>Workspace</PanelItem>
      <PanelItem href="/docs" className="external-docs">Documentation</PanelItem>
      <PanelItem action={<Button look="quiet" onClick={modify}>Rename</Button>}>Editable item</PanelItem>
      <PanelBlock label="Notes" note="Saved when the host accepts them"><span>{note}</span></PanelBlock>
    </Panel>
    <Panel><PanelText label="Notes" value={note} onValueChange={setNote} onCommit={modify} maxLength={500} placeholder="Add context" error={null} rows={3} disabled={false} disabledReason="Saving changes." /></Panel>
    <Actions aria-label="Workspace actions">
      <Action icon={<span aria-hidden="true">A</span>} to="/archive" onPointerEnter={() => undefined} onFocus={() => undefined}>Archive</Action>
      <Action icon={<span aria-hidden="true">D</span>} href="/download" disabled>Download</Action>
      <Action icon={<span aria-hidden="true">R</span>} danger onClick={modify}>Remove</Action>
    </Actions>

    <SettingsDialog<Section> open={open} onOpenChange={setOpen} title="Workspace settings" eyebrow="Workspace" sections={sections} section={section} onSection={setSection} changes={changes} changesWords={count => `${count} pending changes`} onSubmit={() => setChanges(0)} save="Apply" cancel="Close" problem={null} disabled={false} disabledReason="Wait for saving.">
      <SettingsPane<Section> value="details" label="Details"><PanelText label="Workspace notes" value={note} onValueChange={setNote} /></SettingsPane>
      <SettingsPane<Section> value="appearance" label="Appearance"><ModeChoice value={mode} onChange={setMode} /></SettingsPane>
    </SettingsDialog>
    <SettingsSection title="Existing generic section" titleId="generic-heading" headingLevel={3} headingProps={{ ref: headingRef, tabIndex: -1 }}><p>The historical SettingsSection runtime remains separate from SettingsPaneSection.</p></SettingsSection>

    <PlacePicker value={placeValue} onValueChange={setPlaceValue} spaces={spaces} projects={projects} organization now={{ space: { id: "design", name: "Design" }, project: { id: "system", name: "System" } }} aria-label="Destination" label="Destination" size="xs" disabled={false} disabledReason="Saving destination." />
    <output>{placeWords(spaces[0] ?? null, projects[0] ?? null)}</output>
    <Player ref={mediaRef} src="/host-authorized/recording.webm" aria-label="Recording" onTime={setElapsed} onError={modify} />
    <Player src="/host-authorized/recording.wav" audio aria-label="Audio recording" onTime={ms => setElapsed(ms)} />
    <output>{elapsed}</output>
    <TimeField {...timeField} />
    <TimePicker {...timePicker} />

    <RowButton icon={<span aria-hidden="true">+</span>} onClick={modify} disabled={false}>Add a record</RowButton>
    <RowButton face={<span aria-hidden="true">M</span>} aria-label="Choose member">Morgan</RowButton>
    <Table<RecordRow> columns={columns} rows={rows} rowKey={row => row.id} sort={sort} onSortChange={setSort} look="roster" height="20rem" currentKey="one" tableRef={tableRef} aria-label="Records" tableProps={{ id: "records-table" }} rowProps={row => ({ "data-record": row.id, "aria-selected": row.id === "one" })} rowPressable={row => row.editable} onRowPress={row => setNote(row.title)} after={row => row.editable ? <small>Editable</small> : null} empty="No records" cell={(row, column) => column.key === "title" ? <Cell strong title={row.title} mark={<span aria-hidden="true">D</span>} onPress={() => setNote(row.title)} tip="Open record">{row.title}</Cell> : <Cell quiet>{row.size}</Cell>} />

    <WrappingRow ref={divRef} role="group" aria-label="Wrapping content"><span>Native div content</span></WrappingRow>
    <WrappingRow {...buttonRowProps} onClick={event => { event.currentTarget.disabled = true; }}>Native button row</WrappingRow>
    <WrappingRow as="a" ref={anchorRef} href="/records" target="_blank" rel="noreferrer" onClick={event => { event.currentTarget.href.toUpperCase(); }}>Native link row</WrappingRow>
    <WrappingRow as={RouterLink} ref={anchorRef} to={{ pathname: "/workspace" }} analyticsKey="workspace-row" replace onClick={event => { event.currentTarget.focus(); }}>Custom router row</WrappingRow>
    <Button ref={buttonRef} look="glass" size="xs" square round tone="accent" disabledReason="Saving changes." aria-describedby="time-description">+</Button>
    <Button look="line" size="xs">Compact action</Button>
    <IconButton ref={buttonRef} label="Edit record" icon={<span aria-hidden="true">E</span>} look="glass" size="xs" round keepFocus disabledReason="Saving changes." />
    <Select label="Status" value={status} onValueChange={setStatus} items={[{ value: "draft", label: "Draft", start: <span aria-hidden="true">D</span> }, { value: "published", label: "Published" }]} lead="Status" reserve look="text" size="xs" surface="bordered" aria-describedby="time-description" />
    <DatePicker label="Due" value={day} onValueChange={value => setDay(value || null)} today="2026-11-05" min="2026-01-01" max="2027-01-01" none="No due date" lead="Due" look="text" size="xs" surface="flat" name="due" aria-describedby="time-description" />
    <Dialog ref={dialogRef} open={sheetOpen} onOpenChange={setSheetOpen} title="Details sheet" side="right" size="lg" still onSubmit={event => { event.preventDefault(); modify(); }} foot={<Button type="submit" look="line">Save</Button>}>
      <Textarea ref={textareaRef} label="Description" value={note} onValueChange={setNote} count={false} maxLength={500} grow maxRows={6} surface="bordered" aria-invalid={false} aria-describedby="time-description" />
    </Dialog>
  </>;
}

// These errors must remain errors when the fixture is compiled through the packed declarations.
// @ts-expect-error A button row cannot accept an anchor href.
const invalidButtonRow = <WrappingRow as="button" href="/records">Invalid button link</WrappingRow>;
// @ts-expect-error The custom router requires its structured location.
const invalidRouterRow = <WrappingRow as={RouterLink} to="/workspace" analyticsKey="workspace-row">Invalid location</WrappingRow>;
// @ts-expect-error Exact time strings belong to TimePicker, not the minute-valued TimeField.
const invalidTime = <TimeField value="09:30" onValueChange={() => undefined} />;
// @ts-expect-error Generic descriptor values preserve the host's section union.
const invalidSection: SettingsPaneSection<Section> = { value: "billing", label: "Billing" };
void [invalidButtonRow, invalidRouterRow, invalidTime, invalidSection];
