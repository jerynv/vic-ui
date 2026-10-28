import type { ReactNode } from "react";

/**
 * A key name drawn as a key. `name` is what a screen reader hears where the key is drawn as
 * a symbol (`↵` as "Enter"); several keys pressed together are several `Kbd`s side by side.
 */
export function Kbd(props: { children: ReactNode; name?: string; className?: string }) {
  return (
    <kbd className={props.className ? `ui-kbd ${props.className}` : "ui-kbd"}>
      {props.name ? (
        <>
          <span aria-hidden="true">{props.children}</span>
          <span className="sr-only">{props.name}</span>
        </>
      ) : (
        props.children
      )}
    </kbd>
  );
}
