// Adapted from canonical V-Client 555625f4; source transfer authorized by the owner.
import { createContext, useContext, useId, useLayoutEffect, useRef, type FormEvent, type ReactNode } from "react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

/**
 * The settings of one thing (a request, a document, a project): a dialog with a rail of
 * sections on one side and the chosen section's pane on the other, every change held until
 * one Save at the foot, which counts what has changed so far.
 *
 * Each section in the rail carries its state as a mark at its end (`state`: the faces of who
 * is assigned, a flag in the urgency's colour), never a sentence; the chosen section names the
 * pane, which carries no head of its own. Every pane is laid in the same room (`SettingsPane`),
 * the room as tall as the pane showing, eased when another is chosen. On a phone the rail is a
 * row of chips above the pane.
 */
export interface SettingsPaneSection<V extends string> {
  value: V;
  label: ReactNode;
  icon?: ReactNode;
  /** Its state now, as a mark at the row's end: faces, a flag in a colour, a count. */
  state?: ReactNode;
}

export function SettingsDialog<V extends string>(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** What the thing is, over its name: "Request 66". */
  eyebrow?: ReactNode;
  title: ReactNode;
  sections: ReadonlyArray<SettingsPaneSection<V>>;
  section: V;
  onSection: (section: V) => void;
  /** How many changes Save would send; none holds Save and says so. */
  changes: number;
  disabled?: boolean;
  disabledReason?: string | undefined;
  changesWords?: (count: number) => ReactNode;
  save?: ReactNode;
  cancel?: ReactNode;
  problem?: ReactNode;
  onSubmit: () => void;
  className?: string;
  children: ReactNode;
}) {
  const id = useId();
  const words = props.changesWords ?? changesWords;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (props.changes === 0 || props.disabled) return;
    props.onSubmit();
  };
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange} title={props.title} bare className={join("ui-settings-dialog", props.className)}>
      <form className="ui-settings-dialog-form" onSubmit={submit}>
        <nav className="ui-settings-dialog-rail" aria-label="Sections">
          <div className="ui-settings-dialog-head">
            {props.eyebrow ? <span className="ui-settings-dialog-eyebrow">{props.eyebrow}</span> : null}
            <span className="ui-settings-dialog-title" title={typeof props.title === "string" ? props.title : undefined}>
              {props.title}
            </span>
          </div>
          <ul className="ui-settings-dialog-sections">
            {props.sections.map((one) => {
              const current = one.value === props.section;
              return (
                <li key={one.value}>
                  <button
                    type="button"
                    className="ui-settings-dialog-section"
                    aria-current={current ? "true" : undefined}
                    aria-controls={`${id}-${encodeURIComponent(one.value)}`}
                    onClick={() => props.onSection(one.value)}
                  >
                    {one.icon ? <span className="ui-settings-dialog-section-icon">{one.icon}</span> : null}
                    <span className="ui-settings-dialog-section-label">{one.label}</span>
                    {one.state !== undefined && one.state !== null ? <span className="ui-settings-dialog-section-state">{one.state}</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <SettingsRoom.Provider value={{ id, section: props.section }}>
          <Room>{props.children}</Room>
        </SettingsRoom.Provider>
        <div className="ui-dialog-foot ui-settings-dialog-foot">
          <span className="ui-settings-dialog-changes" aria-live="polite">
            {props.problem ?? words(props.changes)}
          </span>
          <Button look="quiet" type="button" onClick={() => props.onOpenChange(false)}>
            {props.cancel ?? "Cancel"}
          </Button>
          <Button look="ink" type="submit" disabled={props.changes === 0 || props.disabled} disabledReason={props.disabled ? props.disabledReason : "Nothing has changed yet."}>
            {props.save ?? "Save changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

/**
 * The room the panes are laid in: as tall as the pane showing, between a floor and a ceiling
 * (the stylesheet's), its height eased rather than snapped when another section is chosen or
 * the pane grows, by measuring the pane showing and setting the room's height from it.
 */
function Room(props: { children: ReactNode }) {
  const room = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const { section } = useRoom();
  useLayoutEffect(() => {
    const el = room.current;
    const panes = inner.current;
    if (!el || !panes) return;
    const set = () => {
      const showing = panes.querySelector<HTMLElement>(".ui-settings-dialog-pane:not([data-away])");
      if (!showing) return;
      const height = showing.getBoundingClientRect().height;
      el.style.setProperty("--settings-dialog-room", `${height}px`);
      // Past the ceiling the room scrolls; under it the room is clipped, so no scrollbar flashes while its height eases.
      el.toggleAttribute("data-scrolls", height > parseFloat(getComputedStyle(el).maxHeight));
    };
    set();
    const watch = new ResizeObserver(set);
    for (const pane of panes.children) watch.observe(pane);
    return () => watch.disconnect();
  }, [section]);
  return (
    <div ref={room} className="ui-settings-dialog-room">
      <div ref={inner} className="ui-settings-dialog-room-inner">
        {props.children}
      </div>
    </div>
  );
}

/** One section's pane: its controls, named by the rail's chosen section, drawn only while chosen. */
export function SettingsPane<V extends string>(props: { value: V; label: string; children: ReactNode }) {
  const room = useRoom();
  const away = room.section !== props.value;
  return (
    <section id={`${room.id}-${encodeURIComponent(props.value)}`} className="ui-settings-dialog-pane" data-away={away ? "" : undefined} inert={away} aria-hidden={away || undefined} aria-label={props.label}>
      <div className="ui-settings-dialog-pane-body">{props.children}</div>
    </section>
  );
}

function changesWords(count: number): string {
  if (count === 0) return "Nothing changed yet";
  return count === 1 ? "1 change" : `${count} changes`;
}

function join(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(" ");
}

const SettingsRoom = createContext<{ id: string; section: string }>({ id: "", section: "" });
function useRoom() {
  return useContext(SettingsRoom);
}
