import { Fragment, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowLeftIcon, BriefcaseIcon, BuildingsIcon, ChevronDownIcon, ChevronRightIcon, FoldersIcon } from "../icons/icons";
import { Popover } from "./Popover";
import { SearchField } from "./SearchField";
import { FieldHead } from "./FieldHead";
import { useFieldReason } from "./reason";

/**
 * Where a thing is filed, chosen the way a file is moved on a phone or in Drive: the field
 * shows the path it is on now, and opens a sheet that lists the whole organization and then
 * every space. Pressing a space goes into it: the first row is the space itself, the rows
 * after it are its projects, and a back arrow at the top returns. Pressing a project or the
 * space itself chooses it and closes the sheet. Typing in the box at the top searches every
 * space and project at once and lists the hits with their path, so a project among eight
 * hundred is three letters away.
 */
export interface PlaceSpace {
  id: string;
  name: string;
  /** Whether the space itself may be chosen, and not only a project in it. */
  whole: boolean;
}

export interface PlaceProject {
  id: string;
  name: string;
  spaceId: string;
}

export interface PlaceValue {
  spaceId: string;
  projectId: string | null;
}

const ORGANIZATION = "The whole organization";

export function PlacePicker(props: {
  value: PlaceValue;
  onValueChange: (value: PlaceValue) => void;
  spaces: readonly PlaceSpace[];
  projects: readonly PlaceProject[];
  /** Whether the whole organization, out of every space, may be chosen. */
  organization: boolean;
  /** Where it is now by name, listed even where it could not be chosen afresh. */
  now?: { space: { id: string; name: string } | null; project: { id: string; name: string } | null };
  "aria-label": string;
  /** Words over the box, as every field here; the picker needs none where a row names it. */
  label?: ReactNode;
  /** The field's height: the page's own unless `sm` (dense) or `xs` (thin). */
  size?: "base" | "sm" | "xs";
  disabled?: boolean;
  disabledReason?: string | undefined;
  className?: string;
}) {
  const field = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // The space the sheet is inside, or null at the top.
  const [inside, setInside] = useState<string | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const why = useFieldReason(props.disabled, props.disabledReason);
  const held = why.held;
  const blocked = Boolean(props.disabled);

  // Native disabled and disabled-with-reason both close the picker. Re-enabling
  // it must not revive a previously open sheet or stale search.
  useEffect(() => {
    if (blocked) { setOpen(false); setQuery(""); setInside(null); }
  }, [blocked]);
  // Entering a space can replace a focused row with a disabled parent row.
  // Keep keyboard navigation inside the new view by returning to its search.
  useEffect(() => {
    if (open && !blocked) search.current?.focus();
  }, [inside, open, blocked]);

  const spaces = useMemo(() => {
    const all = new Map<string, PlaceSpace>();
    for (const space of props.spaces) all.set(space.id, space);
    if (props.now?.space && !all.has(props.now.space.id)) all.set(props.now.space.id, { ...props.now.space, whole: true });
    return all;
  }, [props.spaces, props.now]);
  const projects = useMemo(() => {
    const all = new Map<string, PlaceProject>();
    for (const project of props.projects) all.set(project.id, project);
    if (props.now?.project && !all.has(props.now.project.id)) all.set(props.now.project.id, { ...props.now.project, spaceId: props.now.space?.id ?? "" });
    return all;
  }, [props.projects, props.now]);
  const projectsIn = (spaceId: string) => [...projects.values()].filter((project) => project.spaceId === spaceId);

  const pathOf = (value: PlaceValue): string => {
    if (!value.spaceId) return ORGANIZATION;
    const space = spaces.get(value.spaceId)?.name ?? "";
    const project = value.projectId ? projects.get(value.projectId)?.name : null;
    return project ? `${space} / ${project}` : space;
  };

  const choose = (value: PlaceValue) => {
    if (blocked) return;
    props.onValueChange(value);
    trigger.current?.focus();
    setQuery("");
    setInside(null);
    setOpen(false);
  };
  const onOpen = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
      setInside(null);
    }
  };

  type Row = { key: string; words: string; meta?: string | undefined; icon: ReactNode; into?: string; value?: PlaceValue; chosen: boolean; current: boolean; parent?: boolean };
  const current = (value: PlaceValue) => value.spaceId === props.value.spaceId && (value.projectId ?? null) === (props.value.projectId ?? null);
  const typed = query.trim().toLowerCase();
  const rows: Row[] = [];
  if (typed) {
    if (props.organization && ORGANIZATION.toLowerCase().includes(typed)) rows.push({ key: "", words: ORGANIZATION, icon: <BuildingsIcon size={16} aria-hidden="true" />, value: { spaceId: "", projectId: null }, chosen: true, current: current({ spaceId: "", projectId: null }) });
    for (const space of spaces.values()) {
      if (space.name.toLowerCase().includes(typed)) rows.push({ key: `space:${space.id}`, words: space.name, meta: "Space", icon: <FoldersIcon size={16} aria-hidden="true" />, value: { spaceId: space.id, projectId: null }, chosen: space.whole, current: current({ spaceId: space.id, projectId: null }) });
    }
    for (const project of projects.values()) {
      const space = spaces.get(project.spaceId)?.name ?? "";
      if (project.name.toLowerCase().includes(typed) || `${space} ${project.name}`.toLowerCase().includes(typed)) rows.push({ key: `project:${project.id}`, words: project.name, meta: space, icon: <BriefcaseIcon size={16} aria-hidden="true" />, value: { spaceId: project.spaceId, projectId: project.id }, chosen: true, current: current({ spaceId: project.spaceId, projectId: project.id }) });
    }
  } else if (inside) {
    const space = spaces.get(inside);
    if (space) {
      rows.push({ key: `space:${space.id}`, words: space.name, meta: space.whole ? "The space" : "Only its projects", icon: <FoldersIcon size={16} aria-hidden="true" />, value: { spaceId: space.id, projectId: null }, chosen: space.whole, current: current({ spaceId: space.id, projectId: null }), parent: true });
      for (const project of projectsIn(space.id)) rows.push({ key: `project:${project.id}`, words: project.name, icon: <BriefcaseIcon size={16} aria-hidden="true" />, value: { spaceId: space.id, projectId: project.id }, chosen: true, current: current({ spaceId: space.id, projectId: project.id }) });
    }
  } else {
    if (props.organization || !props.value.spaceId) rows.push({ key: "", words: ORGANIZATION, icon: <BuildingsIcon size={16} aria-hidden="true" />, value: { spaceId: "", projectId: null }, chosen: props.organization, current: current({ spaceId: "", projectId: null }) });
    for (const space of spaces.values()) {
      const count = projectsIn(space.id).length;
      rows.push({ key: `space:${space.id}`, words: space.name, meta: count === 0 ? undefined : count === 1 ? "1 project" : `${count} projects`, icon: <FoldersIcon size={16} aria-hidden="true" />, into: space.id, chosen: true, current: props.value.spaceId === space.id });
    }
  }

  const press = (row: Row) => {
    if (row.into) setInside(row.into);
    else if (row.value && row.chosen) choose(row.value);
  };
  const back = () => setInside(null);

  const keyed = (event: KeyboardEvent<HTMLDivElement>) => {
    const rowsInDom = [...(list.current?.querySelectorAll<HTMLButtonElement>(".ui-place-row") ?? [])];
    const buttons = rowsInDom.filter((button) => !button.disabled);
    const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const rowAt = rowsInDom.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      (buttons[at + 1] ?? buttons[0])?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      (at > 0 ? buttons[at - 1] : list.current?.querySelector<HTMLInputElement>("input"))?.focus();
    } else if (event.key === "ArrowLeft" && inside && !typed) {
      event.preventDefault();
      back();
    } else if (event.key === "ArrowRight" && rowAt >= 0 && rows[rowAt]?.into) {
      event.preventDefault();
      setInside(rows[rowAt]!.into!);
    }
  };

  const size = props.size ?? "base";
  const classes = ["ui-field", size === "base" ? "" : "ui-field-sm", size === "xs" ? "ui-field-xs" : "", "ui-place", props.className ?? ""].filter(Boolean).join(" ");
  const insideSpace = inside ? spaces.get(inside) : null;

  return (
    <div className={classes}>
      <FieldHead field={field} label={props.label} />
      <Popover
        open={open && !blocked}
        onOpenChange={onOpen}
        aria-label={props["aria-label"]}
        className="ui-place-sheet"
        trigger={(pop) => (
          <span ref={why.anchor} className="ui-field-box ui-select-box" data-open={open && !blocked ? "" : undefined} data-disabled={blocked ? "" : undefined} {...why.box}>
            <button {...pop} ref={(node) => { pop.ref(node); trigger.current = node; }} id={field} type="button" className="ui-field-input ui-select" aria-label={`${props["aria-label"]}: ${pathOf(props.value)}`} disabled={blocked && !held} aria-disabled={held ? true : undefined} aria-describedby={why.describedBy} onFocus={why.focus} onBlur={why.blur} onKeyDown={why.key} onClick={blocked ? undefined : pop.onClick}>
              <span className="ui-select-lead">{props.value.spaceId ? <FoldersIcon size={16} aria-hidden="true" /> : <BuildingsIcon size={16} aria-hidden="true" />}</span>
              <span className="ui-select-words">{pathOf(props.value)}</span>
            </button>
            <ChevronDownIcon size={16} className="ui-select-caret" aria-hidden="true" />
          </span>
        )}
      >
        <div ref={list} className="ui-place-inner" onKeyDown={keyed}>
          <SearchField ref={search} bare size="sm" autoFocus value={query} onValueChange={setQuery} aria-label="Find a space or a project" placeholder="Find a space or a project" className="ui-place-search" />
          {insideSpace && !typed ? (
            <button type="button" className="ui-place-head" onClick={back}>
              <ArrowLeftIcon size={16} className="ui-place-head-arrow" aria-hidden="true" />
              <span className="ui-place-head-words">{insideSpace.name}</span>
              <span className="ui-place-head-back">Back</span>
            </button>
          ) : null}
          {rows.length === 0 ? (
            <p className="ui-place-none">{typed ? "Nothing is called that." : "Nowhere to put it."}</p>
          ) : (
            <div className="ui-place-rows" role="listbox" aria-label={insideSpace && !typed ? `In ${insideSpace.name}` : "Places"}>
              {rows.map((row) => (
                <Fragment key={row.key}>
                  <button type="button" role="option" aria-selected={row.current} className="ui-place-row" data-into={row.into ? "" : undefined} data-parent={row.parent ? "" : undefined} disabled={!row.chosen && !row.into} onClick={() => press(row)}>
                    <span className="ui-place-row-icon">{row.icon}</span>
                    <span className="ui-place-row-words">{row.words}</span>
                    {row.meta ? <span className="ui-place-row-meta">{row.meta}</span> : null}
                    {row.into ? <ChevronRightIcon size={14} className="ui-place-row-chevron" aria-hidden="true" /> : null}
                  </button>
                  {/* The space itself stands apart from its projects under a rule, as "Move here" does over a folder's contents. */}
                  {row.parent ? <div className="ui-place-rule" role="presentation" /> : null}
                  {row.parent && rows.length === 1 ? <p className="ui-place-none">No projects here.</p> : null}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </Popover>
      {why.node}
    </div>
  );
}

/** The path a place is said by in a sentence or a label: the space, then its project after a slash. */
export function placeWords(space: { name: string } | null, project: { name: string } | null): ReactNode {
  if (!space) return ORGANIZATION;
  return project ? `${space.name} / ${project.name}` : space.name;
}
