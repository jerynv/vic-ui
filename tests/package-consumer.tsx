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
