import { createRef } from "react";
import * as Vic from "vic-ui";
import { Button, Input, ScrollArea, Dialog, Slider, DataTable, Switch, type DataTableColumnDef } from "vic-ui/ui";
import { ArchiveIcon } from "vic-ui/icons";

const input = createRef<HTMLInputElement>();
const dialog = createRef<HTMLDialogElement>();
const columns: DataTableColumnDef<{ name: string }>[] = [{ id: "name", accessorKey: "name", header: "Name" }];
export const example = <>
  <Vic.Input ref={input} name="email" type="email" required />
  <Vic.TextareaControl name="notes" rows={3} />
  <Vic.NativeSelect name="role"><option value="editor">Editor</option></Vic.NativeSelect>
  <Vic.Radio name="plan" value="basic" defaultChecked />
  <Vic.Disclosure summary="Details"><Vic.Skeleton style={{ height: 24 }} /></Vic.Disclosure>
  <Vic.DialogSurface asChild><dialog ref={dialog}>
    <Vic.DialogHeading>Settings</Vic.DialogHeading><Vic.DialogActions>Actions</Vic.DialogActions>
  </dialog></Vic.DialogSurface>
  <Vic.MenuSurface /><Vic.PopoverSurface /><Vic.TooltipSurface />
  <Vic.ScrollArea style={{ height: 120 }}>Activity</Vic.ScrollArea>
  <Vic.Button look="quiet" square round icon={<ArchiveIcon size={16} />} />
  <Button variant="ghost" size="icon" round tone="accent" />
  <Input placeholder="Search" /><ScrollArea>Items</ScrollArea><Dialog />
  <Vic.FilePreviewStage file={{ id: "example", name: "Example.csv" }} tools={<Vic.FilePreviewToolbar><Vic.Button>Columns</Vic.Button></Vic.FilePreviewToolbar>}>
    <Vic.DelimitedPreview input={new Uint8Array([65, 44, 66])} delimiter="," maxRows={10} />
    <Vic.TextPreview input={new Blob(["Text"])} maxLines={100} />
    <Vic.ImagePreview input={new Blob()} alt="Example" maxBytes={1024} />
    <Vic.FilePreviewStatus status="loading" />
  </Vic.FilePreviewStage>
  <Vic.FilePreviewDialog items={[{ id: "example", label: "Example", content: <Vic.TextPreview input={new Blob()} /> }]} activeId={null} onActiveIdChange={() => {}} />
  <Slider defaultValue={[40]} />
  <Vic.Switch look="flat" checked={false} onCheckedChange={() => {}} />
  <Switch look="flat" defaultChecked />
  <DataTable columns={columns} data={[{ name: "Example" }]} />
</>;

// Unresolved declaration imports can silently turn props into any with skipLibCheck.
// These assertions ensure both entry points keep enforcing their actual contracts.
// @ts-expect-error Native looks are restricted.
export const badNative = <Vic.Button look="missing-look" />;
// @ts-expect-error Composable variants are restricted.
export const badComposable = <Button variant="missing-variant" />;
// @ts-expect-error Native Input is not a link.
export const badInput = <Vic.Input href="/" />;
// @ts-expect-error A disclosure requires its summary.
export const badDisclosure = <Vic.Disclosure />;

// @ts-expect-error Native switch looks are restricted.
export const badSwitch = <Vic.Switch checked={false} look="missing-look" />;
// @ts-expect-error Composable switch looks are restricted.
export const badComposableSwitch = <Switch look="missing-look" />;

// @ts-expect-error Preview bytes must be supplied, not a fetch URL.
export const badPreviewInput = <Vic.TextPreview input="https://example.com/private.txt" />;
// @ts-expect-error Delimited preview supports comma or tab only.
export const badDelimiter = <Vic.DelimitedPreview input={new Blob()} delimiter=";" />;
// @ts-expect-error Image previews require an accessible description.
export const badImagePreview = <Vic.ImagePreview input={new Blob()} />;

const models: readonly Vic.ComboboxOption[] = [{ value: "model", label: "Model" }];
export const inlinePicker = <Vic.ComboboxRoot label="Models" items={models} value="model" onValueChange={value => value.toUpperCase()} query="" onQueryChange={query => query.trim()} open onOpenChange={open => !open}>
  <Vic.ComboboxSearch ref={input} placeholder="Search models" />
  <Vic.ComboboxEmpty>No matching models</Vic.ComboboxEmpty>
  <Vic.ComboboxList><Vic.ComboboxGroup label="Available">
    <Vic.ComboboxItem value="model">Model</Vic.ComboboxItem>
  </Vic.ComboboxGroup></Vic.ComboboxList>
  <Vic.Button look="quiet">Configure providers</Vic.Button>
</Vic.ComboboxRoot>;
// @ts-expect-error Keys are stable strings, not catalogue objects.
export const badComboboxItem = <Vic.ComboboxItem value={{ id: "model" }} />;
// @ts-expect-error Root selection is a single string or null.
export const badComboboxValue = <Vic.ComboboxRoot label="Models" items={models} value={[]} children={null} />;
// @ts-expect-error Search is controlled by Root, not an independent value.
export const badComboboxSearch = <Vic.ComboboxSearch value="different" />;
