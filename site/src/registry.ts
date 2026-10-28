/** Every piece the site documents: where it sits in the nav, what it is for and what it exports. */
export interface Piece {
  id: string;
  name: string;
  group: string;
  summary: string;
  exports: string[];
  file: string;
}

export const GROUPS = ["Actions", "Inputs", "Overlays", "Navigation", "Display", "Data", "Feedback", "Timeline"] as const;

export const PIECES: Piece[] = [
  { id: "button", name: "Button", group: "Actions", summary: "A native button in four looks: ink for a page's one committing action, line beside it, quiet for words that act, link for words that act inside a sentence; and a button that chooses a file.", exports: ["Button", "ButtonLink", "FileButton"], file: "Button.tsx" },
  { id: "danger-button", name: "Danger and caution", group: "Actions", summary: "The commit of something that removes or ends, in the danger ink, and of a change to agreed terms, in the caution ink.", exports: ["DangerButton", "CautionButton", "DangerButtonLink"], file: "DangerButton.tsx" },
  { id: "icon-button", name: "Icon button", group: "Actions", summary: "An icon alone that acts, on a button or a link: its words are its accessible name and its tooltip.", exports: ["IconButton", "IconButtonLink"], file: "IconButton.tsx" },
  { id: "choice-cards", name: "Choice cards", group: "Actions", summary: "One of a few as cards, a real radio group, why one cannot be chosen said on the card and what it costs at its end.", exports: ["ChoiceCards"], file: "ChoiceCards.tsx" },
  { id: "choice", name: "Choice", group: "Actions", summary: "One of a row of chips, chosen by colour and fill and never by weight.", exports: ["Choice"], file: "Choice.tsx" },

  { id: "text-field", name: "Text field", group: "Inputs", summary: "A label, a filled box and what is fixed at its end. A short error takes the label's place, so nothing moves.", exports: ["TextField", "FieldHead", "FieldHint"], file: "TextField.tsx" },
  { id: "textarea", name: "Textarea", group: "Inputs", summary: "Words over several lines, at a fixed height or growing with them, with a count where there is a limit.", exports: ["Textarea"], file: "Textarea.tsx" },
  { id: "select", name: "Select", group: "Inputs", summary: "One choice from a list that opens in the top layer, typed ahead and worked by the keyboard.", exports: ["Select", "SelectField"], file: "Select.tsx" },
  { id: "combobox", name: "Combobox", group: "Inputs", summary: "A field that finds as it is typed into, for one choice or several, from a list or from a server, its chips saying how each stands.", exports: ["Combobox"], file: "Combobox.tsx" },
  { id: "search-field", name: "Search field", group: "Inputs", summary: "A field to search with, its mark at the start and a clear press at the end, or bare inside a box of its own.", exports: ["SearchField"], file: "SearchField.tsx" },
  { id: "number-field", name: "Number field", group: "Inputs", summary: "A number with what is fixed before and after it, whole or with decimals.", exports: ["NumberField"], file: "NumberField.tsx" },
  { id: "date-picker", name: "Date picker", group: "Inputs", summary: "A calendar date as YYYY-MM-DD, never an instant, chosen from a month that opens under the field, or a month standing on the page.", exports: ["DatePicker", "MonthGrid"], file: "DatePicker.tsx" },
  { id: "checkbox", name: "Checkbox", group: "Inputs", summary: "A native box with its label, that can say why it cannot be ticked.", exports: ["Checkbox"], file: "Checkbox.tsx" },
  { id: "radio", name: "Radio group", group: "Inputs", summary: "One of a few, as a list, across a row, or as cards with a line each.", exports: ["RadioGroup"], file: "Radio.tsx" },
  { id: "typed-confirm", name: "Typed confirmation", group: "Inputs", summary: "A name, an address or a number typed to confirm what cannot be taken back, its label holding two lines so nothing moves.", exports: ["TypedConfirm", "typedFirst"], file: "TypedConfirm.tsx" },
  { id: "switch", name: "Switch", group: "Inputs", summary: "On or off, taking effect at once.", exports: ["Switch"], file: "Switch.tsx" },

  { id: "dialog", name: "Dialog", group: "Overlays", summary: "A native dialog with a title, a line, a body that scrolls and a foot of actions, in three widths.", exports: ["Dialog", "FootProblem"], file: "Dialog.tsx" },
  { id: "menu", name: "Menu", group: "Overlays", summary: "Actions in a list from a trigger or at a point, with groups, hints, held items, a danger item, words at a row's end, a row holding a control and a head over them all.", exports: ["Menu"], file: "Menu.tsx" },
  { id: "popover", name: "Popover", group: "Overlays", summary: "Anything floated beside its trigger in the top layer, positioned by Floating UI.", exports: ["Popover", "useAnchored", "usePressAway", "atPoint", "LIST_MOST", "LIST_LEAST"], file: "Popover.tsx" },
  { id: "tooltip", name: "Tooltip", group: "Overlays", summary: "A few words on hover after a pause or on focus, never on load, and the reason a held control gives.", exports: ["Tooltip", "useTip", "useReason", "TIP_DELAY_MS"], file: "Tooltip.tsx" },
  { id: "command-palette", name: "Command palette", group: "Overlays", summary: "A search over everything, with grouped results, a crumb under each, and a state for looking and for nothing found.", exports: ["CommandPalette"], file: "CommandPalette.tsx" },
  { id: "emoji-picker", name: "Emoji picker", group: "Overlays", summary: "A grid of emoji in groups, searched by name, in a popover.", exports: ["EmojiPicker", "EMOJI_GROUPS"], file: "EmojiPicker.tsx" },

  { id: "tabs", name: "Tabs", group: "Navigation", summary: "The one switcher between views: an ink indicator that eases from tab to tab, and counts that never move the row.", exports: ["Tabs"], file: "Tabs.tsx" },
  { id: "trail", name: "Trail", group: "Navigation", summary: "Where a page sits: each step above it a link back, then its own name, folding on a phone.", exports: ["Trail"], file: "Trail.tsx" },
  { id: "pagination", name: "Pagination", group: "Navigation", summary: "Pages of a counted list, or a cursor through one that is not counted.", exports: ["Pagination", "CursorPagination", "rangeWords"], file: "Pagination.tsx" },
  { id: "table-of-contents", name: "Table of contents", group: "Navigation", summary: "The sections of a long page in groups, the current one marked.", exports: ["TableOfContents"], file: "TableOfContents.tsx" },
  { id: "sidebar", name: "Sidebar", group: "Navigation", summary: "A rail of places that folds to its icons, and is a sheet over the page on a phone.", exports: ["SidebarProvider", "Sidebar", "SidebarHeader", "SidebarContent", "SidebarFooter", "SidebarGroup", "SidebarGroupLabel", "SidebarMenu", "SidebarMenuItem", "SidebarMenuButton", "SidebarMenuBadge", "useSidebar"], file: "Sidebar.tsx" },
  { id: "sliding-views", name: "Sliding views", group: "Navigation", summary: "Two views in one pane, the second sliding in over the first.", exports: ["SlidingViews", "SlidingView"], file: "SlidingViews.tsx" },

  { id: "badge", name: "Badge", group: "Display", summary: "A standing state in a tone, hairline or solid, with a dot, an icon or a count. State always carries a word.", exports: ["Badge", "Count", "HeadCount", "toneClass"], file: "Badge.tsx" },
  { id: "notice", name: "Notice", group: "Display", summary: "The tone's tint behind a rule in its ink, with a title, words and an action.", exports: ["Notice"], file: "Notice.tsx" },
  { id: "card", name: "Card", group: "Display", summary: "The one surface on the page: an edge and no shadow, lifted or recessed, plain, flush, as a form, or edged in danger.", exports: ["Card"], file: "Card.tsx" },
  { id: "list", name: "Rows", group: "Display", summary: "Groups of rows of one line at one height, each lit only where pressing it goes somewhere, and an empty group said in one quiet line.", exports: ["RowGroup", "Rows", "Row", "RowsMore", "EmptyLine"], file: "List.tsx" },
  { id: "accordion", name: "Accordion", group: "Display", summary: "Sections that open one at a time or several, worked by the arrow keys.", exports: ["Accordion", "AccordionItem"], file: "Accordion.tsx" },
  { id: "avatar-stack", name: "Avatar stack", group: "Display", summary: "Faces overlapping, each cut back by the one before, with a count of the rest.", exports: ["AvatarStack"], file: "AvatarStack.tsx" },
  { id: "kbd", name: "Key", group: "Display", summary: "A key name drawn as a key, with what a screen reader hears.", exports: ["Kbd"], file: "Kbd.tsx" },
  { id: "announcement", name: "Announcement", group: "Display", summary: "A small pill: a tag in a hue, the words and an arrow, the whole of it one link.", exports: ["Announcement"], file: "Announcement.tsx" },
  { id: "empty", name: "Empty", group: "Display", summary: "What a place is for and the one action that ends its emptiness, over the shape of what is coming.", exports: ["Empty", "EmptyArt", "EmptyLine"], file: "Empty.tsx" },
  { id: "flow", name: "Flow", group: "Display", summary: "A tree drawn top down with ruled connectors, for a chart of who reports to whom.", exports: ["Flow"], file: "Flow.tsx" },
  { id: "org-mark", name: "Mark and hues", group: "Display", summary: "A place's first letter on a tile in one of the five hues, chosen by hashing what names it.", exports: ["OrgMark", "HUES", "hueFor"], file: "OrgMark.tsx" },

  { id: "table", name: "Table", group: "Data", summary: "One dense table with a pinned head, sorting, a current row, rows that open and a line under a row.", exports: ["Table"], file: "Table.tsx" },

  { id: "problem", name: "Problem", group: "Feedback", summary: "A refusal or a failure on a line of its own, in the danger ink, saying what to do next.", exports: ["Problem"], file: "Problem.tsx" },
  { id: "spinner", name: "Spinner", group: "Feedback", summary: "Something under way, at any size, named for a screen reader.", exports: ["Spinner"], file: "Spinner.tsx" },
  { id: "progress", name: "Progress", group: "Feedback", summary: "How far, in words as well as a bar, in a tone where it means something.", exports: ["Progress"], file: "Progress.tsx" },
  { id: "toast", name: "Toast", group: "Feedback", summary: "A short word that something happened, with an action, in a tone, staying where it must.", exports: ["toast", "Toaster"], file: "Toast.tsx" },

  { id: "timeline", name: "Timeline pieces", group: "Timeline", summary: "A day's divider, what people said back, and the bar of actions laid over a message.", exports: ["TimelineDivider", "Reaction", "Reactions", "ActionBar", "ActionBarRule"], file: "Timeline.tsx" },
  { id: "media", name: "Media grid", group: "Timeline", summary: "Pictures and films in a grid that keeps its size before the bytes arrive.", exports: ["MediaGrid", "MEDIA_WIDE", "MEDIA_TALL"], file: "Attachment.tsx" },
  { id: "files", name: "Files", group: "Timeline", summary: "A file as a card, several as uniform tiles, and a chip for one being sent.", exports: ["FileCard", "FileGrid", "FileTile", "FileChip"], file: "Attachment.tsx" },
];

export const PAGES = [
  { id: "start", name: "Getting started", group: "Foundations" },
  { id: "colour", name: "Colour", group: "Foundations" },
  { id: "type", name: "Type", group: "Foundations" },
  { id: "shape", name: "Corners and elevation", group: "Foundations" },
  { id: "rules", name: "Rules", group: "Foundations" },
  { id: "icons", name: "Icons", group: "Foundations" },
] as const;
