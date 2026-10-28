/**
 * What every list-shaped piece of the library takes (`Select`, `RadioGroup`, `Combobox`,
 * `Menu`, `Tabs` and the rest), in whichever shape the caller already holds: a record of
 * value to words, pairs in order, or options that can also be disabled, grouped or carry a
 * line under their words. `toOptions` turns any of them into options, so a piece reads one
 * shape and a page never converts for it.
 */
import type { ReactNode } from "react";

export interface Option {
  value: string;
  label: ReactNode;
  /** The words a typed search and type-ahead match; `label` when it is a string. */
  text?: string;
  /** A line under the label, quieter. */
  hint?: ReactNode;
  /** What leads it, any element: a face, an icon, a flag. Drawn in the list, on its chip and beside it once chosen. */
  start?: ReactNode;
  disabled?: boolean;
  /** Why a disabled option cannot be chosen, said on hover. */
  reason?: string;
  /** Options sharing a group are drawn together under it, in the order groups first appear. */
  group?: string;
}

export type Items = Record<string, string> | ReadonlyArray<readonly [string, string]> | ReadonlyArray<Option>;

export function toOptions(items: Items): Option[] {
  if (!Array.isArray(items)) return Object.entries(items as Record<string, string>).map(([value, label]) => ({ value, label, text: label }));
  return (items as ReadonlyArray<readonly [string, string] | Option>).map((one) => (Array.isArray(one) ? { value: one[0], label: one[1], text: one[1] } : { ...(one as Option), text: (one as Option).text ?? (typeof (one as Option).label === "string" ? ((one as Option).label as string) : (one as Option).value) }));
}

/** The words an option is matched by. */
export function textOf(option: Option): string {
  return option.text ?? (typeof option.label === "string" ? option.label : option.value);
}
