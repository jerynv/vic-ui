import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { WebsiteTheme } from "../components/theme";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: { title: <span className="font-mono text-xl font-semibold tracking-tight">vic/ui</span>, url: "/" },
    githubUrl: "https://github.com/jerynv/vic-ui",
    links: [{ text: "Documentation", url: "/docs", active: "nested-url" }, { text: "Icons", url: "/icons", active: "url" }],
    slots: { themeSwitch: WebsiteTheme },
  };
}
