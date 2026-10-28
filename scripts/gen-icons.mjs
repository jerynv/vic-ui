// Writes src/icons/icons.tsx from the icon sets installed as dev dependencies,
// so the application carries only the icons it draws and the build never reaches the
// network.
//
//   node scripts/gen-icons.mjs
//
// Each entry names the icon the application uses, the outline drawn normally and the
// filled one drawn where a place is the one you are in. Nearly every shape comes from
// Tabler (MIT), chosen for its single consistent stroke and a filled twin for most
// shapes; the one it has no twin for, and the one shape it has no equivalent for at all,
// come from MingCute (Apache 2.0), kept for that name alone rather than shipping a wrong
// shape. The names are the ones the application already used, so swapping a set is a
// change to this list and nothing else. See THIRD_PARTY_NOTICES.md.
//
// Our own drawings sit beside them as the "own" set: one SVG per file in src/icons/own,
// named "own:<file name without .svg>" here, and a filled twin, where one is drawn, in
// "<name>.fill.svg". Each file is a whole <svg> with a viewBox, drawn in currentColor so
// it takes the colour of the text around it. A file with a script, an event handler, a
// link or a foreign object is refused rather than copied into the application.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
/** src/icons/own/*.svg, in the shape an Iconify set has, so `shape()` reads it the same way. */
function ownSet() {
  const dir = new URL("../src/icons/own/", import.meta.url);
  const icons = {};
  for (const file of readdirSync(dir).filter((one) => one.endsWith(".svg"))) {
    const text = readFileSync(new URL(file, dir), "utf8");
    if (/<script|<foreignObject|\son[a-z]+\s*=|\s(xlink:)?href\s*=/i.test(text)) throw new Error(`${file}: scripts, handlers and links are not allowed in an icon`);
    const svg = text.match(/<svg\b([^>]*)>([\s\S]*)<\/svg>/i);
    if (!svg) throw new Error(`${file}: not an <svg>`);
    const box = svg[1].match(/viewBox="\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*"/);
    if (!box) throw new Error(`${file}: needs a viewBox`);
    // The outer element's own fill is carried onto a group, so "fill=none" still holds.
    const fill = svg[1].match(/\sfill="([^"]*)"/)?.[1];
    const body = svg[2].replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
    icons[file.slice(0, -4)] = { body: fill ? `<g fill="${fill}">${body}</g>` : body, width: Number(box[1]), height: Number(box[2]) };
  }
  return { icons };
}

const SETS = {
  tabler: require("@iconify-json/tabler/icons.json"),
  mingcute: require("@iconify-json/mingcute/icons.json"),
  own: ownSet(),
};

/** The name the application uses, and [outline, filled] as "set:icon". */
const ICONS = {
  HouseIcon: ["tabler:home", "tabler:home-filled"],
  MagnifyingGlassIcon: ["tabler:search", "tabler:search-filled"],
  ChatsCircleIcon: ["tabler:message-circle", "tabler:message-circle-filled"],
  ChatCircleIcon: ["tabler:message", "tabler:message-filled"],
  ClipboardTextIcon: ["tabler:clipboard-text", "tabler:clipboard-text-filled"],
  FileTextIcon: ["tabler:file-text", "tabler:file-text-filled"],
  FoldersIcon: ["tabler:folders", "tabler:folders-filled"],
  BriefcaseIcon: ["tabler:briefcase", "tabler:briefcase-filled"],
  // Tabler has no filled multi-person shape at all (only a single filled user), and the
  // rail fills this icon when People is the page you are on, so MingCute stays here.
  UsersThreeIcon: ["mingcute:group-line", "mingcute:group-fill"],
  TreeStructureIcon: ["tabler:sitemap", "tabler:sitemap-filled"],
  ScalesIcon: ["tabler:scale", "tabler:scale-filled"],
  ScrollIcon: ["tabler:notebook"],
  GearIcon: ["tabler:settings", "tabler:settings-filled"],
  SignOutIcon: ["tabler:logout"],
  CopyIcon: ["tabler:copy"],
  CheckIcon: ["tabler:check"],
  ChevronUpDownIcon: ["tabler:selector"],
  CheckCircleIcon: ["tabler:circle-check", "tabler:circle-check-filled"],
  InfoCircleIcon: ["tabler:info-circle", "tabler:info-circle-filled"],
  AlertTriangleIcon: ["tabler:alert-triangle", "tabler:alert-triangle-filled"],
  AlertCircleIcon: ["tabler:alert-circle", "tabler:alert-circle-filled"],
  DotsThreeIcon: ["tabler:dots"],
  PaperclipIcon: ["tabler:paperclip"],
  LinkSimpleIcon: ["tabler:link"],
  TrashIcon: ["tabler:trash"],
  ThumbsUpIcon: ["tabler:thumb-up", "tabler:thumb-up-filled"],
  EyeIcon: ["tabler:eye", "tabler:eye-filled"],
  TextBIcon: ["tabler:bold"],
  TextItalicIcon: ["tabler:italic"],
  TextStrikethroughIcon: ["tabler:strikethrough"],
  TextAaIcon: ["tabler:letter-case"],
  CodeIcon: ["tabler:code"],
  CodeBlockIcon: ["tabler:terminal-2"],
  QuotesIcon: ["tabler:quote"],
  ListNumbersIcon: ["tabler:list-numbers"],
  ListBulletsIcon: ["tabler:list"],
  KanbanIcon: ["tabler:layout-kanban", "tabler:layout-kanban-filled"],
  AtIcon: ["tabler:at"],
  SmileyIcon: ["tabler:mood-smile", "tabler:mood-smile-filled"],
  PlusIcon: ["tabler:plus"],
  PencilSimpleIcon: ["tabler:pencil"],
  PaperPlaneRightIcon: ["tabler:send-2"],
  ArrowUpIcon: ["tabler:arrow-up"],
  ShieldCheckIcon: ["tabler:shield-check", "tabler:shield-check-filled"],
  GlobeHemisphereWestIcon: ["tabler:world"],
  FilePdfIcon: ["tabler:file-type-pdf"],
  DownloadSimpleIcon: ["tabler:download"],
  ArrowUpRightIcon: ["tabler:arrow-up-right"],
  ArrowDownIcon: ["tabler:arrow-down"],
  XIcon: ["tabler:x"],
  MenuIcon: ["tabler:menu-2"],
  UserPlusIcon: ["tabler:user-plus"],
  // One person, for a conversation with one person. The set had only a group and an
  // add-person, so a direct message had nothing of its own to be marked with.
  UserIcon: ["tabler:user", "tabler:user-filled"],
  // The rail itself, for the row that folds it. The same glyph every editor and
  // console uses for this, rather than a chevron that has to be read as a direction.
  SidebarIcon: ["tabler:layout-sidebar", "tabler:layout-sidebar-filled"],
  // Ours (src/icons/own): the one chevron every "open this" and "more below" points with,
  // and the same stroke turned to point along a row. Kumo draws its own arrows inside its
  // select, picker and collapsible; the stylesheet paints this same file over those.
  ChevronDownIcon: ["own:chevron-down"],
  ChevronRightIcon: ["own:chevron-right"],
  ChevronLeftIcon: ["own:chevron-left"],
  ArrowRightIcon: ["tabler:arrow-right"],
  DotsVerticalIcon: ["tabler:dots-vertical"],
  DeviceIcon: ["tabler:device-desktop"],
  SunIcon: ["tabler:sun"],
  MoonIcon: ["tabler:moon"],
  SchoolIcon: ["tabler:school"],
  BuildingsIcon: ["tabler:buildings"],
  HandHeartIcon: ["tabler:heart-handshake"],
  LockIcon: ["tabler:lock"],
  KeyIcon: ["tabler:key"],
  SignatureIcon: ["tabler:signature"],
  FingerprintIcon: ["tabler:fingerprint"],
  EyeSlashIcon: ["tabler:eye-off"],
  FlagIcon: ["tabler:flag", "tabler:flag-filled"],
  DoorIcon: ["tabler:door"],
  ClockCounterClockwiseIcon: ["tabler:history"],
  PushPinIcon: ["tabler:pinned", "tabler:pinned-filled"],
  PushPinFilledIcon: ["tabler:pinned-filled"],
  HashIcon: ["tabler:hash"],
  ArrowLeftIcon: ["tabler:arrow-left"],
  // The file browser: a place is a folder, a Word file has its own mark beside the PDF
  // one, and uploading and moving are the two things done to a file from its row.
  FolderIcon: ["tabler:folder", "tabler:folder-filled"],
  FileDocxIcon: ["tabler:file-type-docx"],
  UploadIcon: ["tabler:upload"],
  FolderMoveIcon: ["tabler:folder-symlink"],
  // The operator's console: the pipeline of leads, the calendar of demonstrations, the
  // hours they are offered in, what each organisation pays, and what is connected.
  FunnelIcon: ["tabler:filter", "tabler:filter-filled"],
  TagIcon: ["tabler:tag", "tabler:tag-filled"],
  CalendarEventIcon: ["tabler:calendar-event", "tabler:calendar-event-filled"],
  ClockIcon: ["tabler:clock", "tabler:clock-filled"],
  ReceiptIcon: ["tabler:receipt", "tabler:receipt-filled"],
  PlugIcon: ["tabler:plug-connected"],
  // A call: joining one, the microphone, the camera and a shared screen, each with the
  // shape it has when off, the stage made larger and smaller, and the mark a recording
  // carries for as long as it runs.
  PhoneIcon: ["tabler:phone", "tabler:phone-filled"],
  MicrophoneIcon: ["tabler:microphone", "tabler:microphone-filled"],
  MicrophoneOffIcon: ["tabler:microphone-off"],
  VideoIcon: ["tabler:video", "tabler:video-filled"],
  VideoOffIcon: ["tabler:video-off"],
  ScreenShareIcon: ["tabler:screen-share"],
  ScreenShareOffIcon: ["tabler:screen-share-off"],
  MaximizeIcon: ["tabler:arrows-maximize"],
  MinimizeIcon: ["tabler:arrows-minimize"],
  RecordIcon: ["tabler:player-record", "tabler:player-record-filled"],
  // A pin lifted off a call's stage.
  PushPinOffIcon: ["tabler:pinned-off"],
  // The console's Features, where each feature is on or off across the organisations.
  ToggleIcon: ["tabler:toggle-right", "tabler:toggle-right-filled"],
  // A page header's actions drawn as icons alone (invariant 19): drafting a document,
  // the certificate a sealed file carries, starting a call and who came to events.
  FilePlusIcon: ["tabler:file-plus"],
  FileIcon: ["tabler:file"],
  FolderPlusIcon: ["tabler:folder-plus"],
  FolderUpIcon: ["tabler:folder-up"],
  CertificateIcon: ["tabler:certificate"],
  PhonePlusIcon: ["tabler:phone-plus"],
  UserCheckIcon: ["tabler:user-check"],
  // The drawn chart's canvas: zooming in and out, and fitting the whole chart in view.
  ZoomInIcon: ["tabler:zoom-in"],
  ZoomOutIcon: ["tabler:zoom-out"],
  ZoomFitIcon: ["tabler:zoom-scan"],
  // Arranging the chart's boxes by hand, and laying them out from the reporting lines again.
  ArrangeIcon: ["tabler:arrows-move"],
  TidyIcon: ["tabler:layout-distribute-horizontal"],
  // A person's card's way to their row on People.
  AddressBookIcon: ["tabler:address-book"],
  // Each kind of file Docs keeps (D-0386), for its row and its viewer (`fileKindIcon`).
  FilePhotoIcon: ["tabler:photo", "tabler:photo-filled"],
  FileVectorIcon: ["tabler:file-type-svg"],
  FileVideoIcon: ["tabler:movie"],
  FileMusicIcon: ["tabler:file-music", "tabler:file-music-filled"],
  FileSpreadsheetIcon: ["tabler:file-spreadsheet"],
  FileTableIcon: ["tabler:file-type-csv"],
  FilePresentationIcon: ["tabler:presentation", "tabler:presentation-filled"],
  FileCodeIcon: ["tabler:file-code", "tabler:file-code-filled"],
  FileMarkdownIcon: ["tabler:markdown"],
};

function shape(ref) {
  const [prefix, name] = ref.split(":");
  const set = SETS[prefix];
  if (!set) throw new Error(`no icon set ${prefix}`);
  const icon = set.icons[name] ?? (set.aliases?.[name] ? set.icons[set.aliases[name].parent] : undefined);
  if (!icon) throw new Error(`no icon ${ref}`);
  return { body: icon.body, width: icon.width ?? set.width ?? 24, height: icon.height ?? set.height ?? 24 };
}

const lines = [
  "// Generated by scripts/gen-icons.mjs. Do not edit by hand; change the list there and run it.",
  "// Tabler Icons (MIT, https://tabler.io/icons), MingCute Icon (Apache-2.0,",
  "// https://github.com/Richard9394/MingCute), and our own drawings in src/icons/own.",
  "",
  'import { makeIcon, type IconShapes } from "./icon-base";',
  "",
  'export type { Icon, IconProps } from "./icon-base";',
  "",
];
for (const [name, [line, fill]] of Object.entries(ICONS)) {
  const shapes = { line: shape(line), fill: fill ? shape(fill) : null };
  lines.push(`export const ${name} = makeIcon("${name}", ${JSON.stringify(shapes)} satisfies IconShapes);`);
}
lines.push("");

const target = new URL("../src/icons/icons.tsx", import.meta.url);
writeFileSync(target, lines.join("\n"));
console.log(`wrote ${Object.keys(ICONS).length} icons to ${target.pathname}`);
