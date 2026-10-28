import type { ComponentProps, ReactNode } from "react";
import { TextField } from "./TextField";

/** What a commit held by a typed confirmation says on hover and focus: `Type halden.example.com first.` */
export function typedFirst(expect: string): string {
  return `Type ${expect} first.`;
}

/**
 * The field that takes a name, an address or a number typed to confirm something that cannot
 * be taken back. Its label keeps two lines whatever it says, since what is typed is as long as
 * its name, so the field under it stands where the placeholder put it and never moves when the
 * label wraps. It only collects the words: the commit beside it is held until they match, and
 * says why with `typedFirst`, and the server compares them again and refuses a mismatch.
 */
export function TypedConfirm(
  props: Omit<ComponentProps<typeof TextField>, "value" | "onChange" | "label"> & {
    expect: string;
    value: string;
    onValueChange?: (value: string) => void;
    /** The words over the field: `Type {expect} to confirm` unless given. */
    label?: ReactNode;
  },
) {
  const { expect, value, onValueChange, label, placeholder, ...rest } = props;
  return (
    <TextField
      label={<span className="ui-confirm-label">{label ?? `Type ${expect} to confirm`}</span>}
      placeholder={placeholder ?? (expect || undefined)}
      autoComplete="off"
      spellCheck={false}
      value={value}
      onChange={(event) => onValueChange?.(event.target.value)}
      {...rest}
    />
  );
}
