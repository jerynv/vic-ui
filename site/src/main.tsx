import { StrictMode, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  IconButton,
  SearchField,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  Tabs,
  Toaster,
  useSidebar,
} from "vic-ui";
import { MenuIcon } from "vic-ui/icons";
import "vic-ui/styles.css";
import "./site.css";
import { useMode, type Mode } from "./lib/mode";
import { GROUPS, PAGES, PIECES } from "./registry";
import { PiecePage } from "./pages/Piece";
import { Start } from "./pages/Start";
import { Colour } from "./pages/Colour";
import { Type } from "./pages/Type";
import { Shape } from "./pages/Shape";
import { Rules } from "./pages/Rules";
import { Icons } from "./pages/Icons";
import { NotFound } from "./pages/NotFound";

const VERSION = "0.1.0";

/** The page named by the hash (`#/button`), so the site needs no server rewrite on GitHub Pages. */
function useRoute(): string {
  const read = () => window.location.hash.replace(/^#\/?/, "").split(/[?#]/)[0] || "start";
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const changed = () => setRoute(read());
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);
  return route;
}

interface Entry {
  id: string;
  name: string;
  group: string;
  words: string;
}

const ENTRIES: Entry[] = [
  ...PAGES.map((page) => ({ id: page.id, name: page.name, group: page.group, words: page.name })),
  ...PIECES.map((piece) => ({ id: piece.id, name: piece.name, group: piece.group, words: `${piece.name} ${piece.summary} ${piece.exports.join(" ")}` })),
];

function Nav(props: { route: string }) {
  const [query, setQuery] = useState("");
  const { isMobile, setOpenMobile } = useSidebar();
  const found = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return words.length === 0 ? ENTRIES : ENTRIES.filter((entry) => words.every((word) => entry.words.toLowerCase().includes(word)));
  }, [query]);
  const groups = ["Foundations", ...GROUPS].map((group) => ({ group, entries: found.filter((entry) => entry.group === group) })).filter((one) => one.entries.length > 0);

  // Every move closes the phone's sheet, so the page keeps its whole width.
  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [props.route]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Sidebar aria-label="Contents">
      <SidebarHeader>
        <a href="#/start" className="site-wordmark">
          vic-ui
        </a>
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const first = found[0];
            if (first) window.location.hash = `#/${first.id}`;
          }}
        >
          <SearchField aria-label="Search the system" size="sm" placeholder="Search" value={query} onValueChange={setQuery} />
        </form>
      </SidebarHeader>
      <SidebarContent>
        {groups.map(({ group, entries }) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{group}</SidebarGroupLabel>
            <SidebarMenu>
              {entries.map((entry) => (
                <SidebarMenuButton key={entry.id} href={`#/${entry.id}`} active={props.route === entry.id} aria-current={props.route === entry.id ? "page" : undefined}>
                  {entry.name}
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
        {groups.length === 0 ? <p className="site-nav-none">Nothing is called that. Try fewer words.</p> : null}
      </SidebarContent>
      <SidebarFooter>
        <p className="site-nav-foot">Version {VERSION}, MIT</p>
      </SidebarFooter>
    </Sidebar>
  );
}

function Bar(props: { title: string; mode: Mode; onMode: (mode: Mode) => void }) {
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <header className="site-bar">
      {isMobile ? <IconButton look="line" size="md" icon={<MenuIcon size={16} />} label="Contents" onClick={() => setOpenMobile(true)} /> : null}
      <span className="site-bar-title">{props.title}</span>
      <Tabs aria-label="Appearance" size="sm" items={{ system: "System", light: "Light", dark: "Dark" }} value={props.mode} onValueChange={(value) => props.onMode(value as Mode)} />
    </header>
  );
}

function pageFor(route: string): { title: string; body: ReactNode } {
  const piece = PIECES.find((one) => one.id === route);
  if (piece) return { title: piece.name, body: <PiecePage piece={piece} /> };
  switch (route) {
    case "start":
      return { title: "Getting started", body: <Start /> };
    case "colour":
      return { title: "Colour", body: <Colour /> };
    case "type":
      return { title: "Type", body: <Type /> };
    case "shape":
      return { title: "Corners and elevation", body: <Shape /> };
    case "rules":
      return { title: "Rules", body: <Rules /> };
    case "icons":
      return { title: "Icons", body: <Icons /> };
    default:
      return { title: "Not here", body: <NotFound /> };
  }
}

function App() {
  const route = useRoute();
  const [mode, setMode] = useMode();
  const main = useRef<HTMLElement>(null);
  const page = pageFor(route);
  useEffect(() => {
    main.current?.scrollTo({ top: 0 });
    document.title = route === "start" ? "vic-ui" : `${page.title}, vic-ui`;
  }, [route, page.title]);
  return (
    <SidebarProvider collapsible="none" mobileBreakpoint={860} className="site-shell">
      <Nav route={route} />
      <main className="site-main" ref={main}>
        <Bar title={page.title} mode={mode} onMode={setMode} />
        <div className="site-page">{page.body}</div>
      </main>
      <Toaster />
    </SidebarProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
