import type { Placement } from "@floating-ui/dom";
import { useMemo, useRef, useState, type KeyboardEvent, type ReactElement } from "react";
import { Popover, type PopoverTriggerProps } from "./Popover";
import { SearchField } from "./SearchField";

/** An emoji and the words it is found by. */
export interface Emoji {
  char: string;
  name: string;
}

/** The emoji offered, in groups, each with the words a search finds it by. */
export const EMOJI_GROUPS: ReadonlyArray<{ label: string; emoji: readonly Emoji[] }> = [
  {
    label: "Faces",
    emoji: [
      ["😀", "grin smile happy"],
      ["😄", "laugh smile happy"],
      ["😂", "tears of joy laugh"],
      ["🙂", "slight smile"],
      ["😉", "wink"],
      ["😊", "blush smile"],
      ["😍", "heart eyes love"],
      ["😎", "cool sunglasses"],
      ["🤔", "thinking hmm"],
      ["😅", "sweat smile relief"],
      ["😬", "grimace awkward"],
      ["🙃", "upside down"],
      ["😮", "surprised wow"],
      ["😢", "cry sad"],
      ["😭", "sob crying"],
      ["😴", "sleep tired"],
      ["🤯", "mind blown"],
      ["🥳", "party celebrate"],
      ["😇", "angel innocent"],
      ["🤗", "hug"],
      ["🫡", "salute"],
      ["😐", "neutral"],
      ["🙄", "eye roll"],
      ["😡", "angry"],
    ].map(([char, name]) => ({ char: char!, name: name! })),
  },
  {
    label: "Hands",
    emoji: [
      ["👍", "thumbs up yes agree"],
      ["👎", "thumbs down no"],
      ["👏", "clap applause"],
      ["🙌", "raised hands hooray"],
      ["🙏", "thanks please pray"],
      ["👋", "wave hello bye"],
      ["🤝", "handshake deal"],
      ["✌️", "peace victory"],
      ["🤞", "fingers crossed luck"],
      ["👌", "ok perfect"],
      ["💪", "strong muscle"],
      ["👀", "eyes looking"],
    ].map(([char, name]) => ({ char: char!, name: name! })),
  },
  {
    label: "Things",
    emoji: [
      ["❤️", "heart love red"],
      ["🔥", "fire hot lit"],
      ["🎉", "tada party celebrate"],
      ["✨", "sparkles new"],
      ["⭐", "star"],
      ["🚀", "rocket launch ship"],
      ["💡", "idea bulb"],
      ["📌", "pin"],
      ["📎", "paperclip attach"],
      ["📅", "calendar date"],
      ["⏰", "alarm clock time"],
      ["☕", "coffee"],
      ["🍕", "pizza"],
      ["🎂", "cake birthday"],
      ["🏆", "trophy win"],
      ["📈", "chart up growth"],
      ["📝", "memo note write"],
      ["🔒", "lock private"],
    ].map(([char, name]) => ({ char: char!, name: name! })),
  },
  {
    label: "Signs",
    emoji: [
      ["✅", "check done yes"],
      ["❌", "cross no wrong"],
      ["⚠️", "warning caution"],
      ["❓", "question"],
      ["❗", "exclamation important"],
      ["💯", "hundred perfect"],
      ["➕", "plus add"],
      ["➡️", "arrow right next"],
      ["🔁", "repeat again"],
      ["🟢", "green circle go"],
      ["🟡", "yellow circle"],
      ["🔴", "red circle stop"],
    ].map(([char, name]) => ({ char: char!, name: name! })),
  },
];

/** What a screen reader hears for one: the first of its words, as a sentence. */
function nameOf(one: Emoji): string {
  const word = one.name.split(" ")[0] ?? one.char;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * A choice of emoji in a popover: a search over the words each is found by, and a grid the
 * arrow keys walk, Enter or a press choosing one. `onPick` is given the emoji as text; the
 * popover closes after it. `trigger` is given the props to spread on what opens it.
 */
export function EmojiPicker(props: { open: boolean; onOpenChange: (open: boolean) => void; onPick: (emoji: string) => void; trigger: (props: PopoverTriggerProps) => ReactElement; placement?: Placement }) {
  const [query, setQuery] = useState("");
  const grid = useRef<HTMLDivElement>(null);
  const wanted = query.trim().toLowerCase();
  const groups = useMemo(
    () => (wanted === "" ? EMOJI_GROUPS : EMOJI_GROUPS.map((group) => ({ ...group, emoji: group.emoji.filter((one) => one.name.split(" ").some((word) => word.startsWith(wanted))) })).filter((group) => group.emoji.length > 0)),
    [wanted],
  );

  const pick = (emoji: string) => {
    props.onPick(emoji);
    props.onOpenChange(false);
    setQuery("");
  };

  // Left and right step in reading order; up and down to the nearest emoji in the row above or below.
  const walk = (event: KeyboardEvent<HTMLDivElement>) => {
    const all = [...(grid.current?.querySelectorAll<HTMLButtonElement>(".ui-emoji") ?? [])];
    const at = all.indexOf(document.activeElement as HTMLButtonElement);
    if (at < 0) return;
    let next: HTMLButtonElement | undefined;
    if (event.key === "ArrowRight") next = all[at + 1];
    else if (event.key === "ArrowLeft") next = all[at - 1];
    else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const here = all[at]!.getBoundingClientRect();
      const down = event.key === "ArrowDown";
      const row = all.filter((one) => (down ? one.getBoundingClientRect().top > here.top + 2 : one.getBoundingClientRect().top < here.top - 2));
      const top = row.length === 0 ? null : down ? Math.min(...row.map((one) => one.getBoundingClientRect().top)) : Math.max(...row.map((one) => one.getBoundingClientRect().top));
      next = row.filter((one) => one.getBoundingClientRect().top === top).sort((a, b) => Math.abs(a.getBoundingClientRect().left - here.left) - Math.abs(b.getBoundingClientRect().left - here.left))[0];
    } else return;
    event.preventDefault();
    next?.focus();
  };

  return (
    <Popover
      open={props.open}
      onOpenChange={(open) => {
        props.onOpenChange(open);
        if (!open) setQuery("");
      }}
      trigger={props.trigger}
      placement={props.placement ?? "top-start"}
      aria-label="Emoji"
      className="ui-emoji-picker"
    >
      <SearchField
        size="sm"
        aria-label="Find an emoji"
        placeholder="Find an emoji"
        value={query}
        onValueChange={setQuery}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            grid.current?.querySelector<HTMLButtonElement>(".ui-emoji")?.focus();
          }
          if (event.key === "Enter") {
            event.preventDefault();
            const first = groups[0]?.emoji[0];
            if (first) pick(first.char);
          }
        }}
      />
      <div ref={grid} className="ui-emoji-scroll" onKeyDown={walk}>
        {groups.length === 0 ? <p className="ui-emoji-none">No emoji is called that.</p> : null}
        {groups.map((group) => (
          <section key={group.label} aria-label={group.label}>
            <h3 className="ui-emoji-group">{group.label}</h3>
            <div className="ui-emoji-grid">
              {group.emoji.map((one) => (
                <button key={one.char} type="button" className="ui-emoji" aria-label={nameOf(one)} onClick={() => pick(one.char)}>
                  {one.char}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Popover>
  );
}
