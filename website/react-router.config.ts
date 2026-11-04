import type { Config } from "@react-router/dev/config";
import { cp, glob, rm } from "node:fs/promises";
import { join } from "node:path";
import { getSlugs } from "fumadocs-core/source";

export default {
  ssr: false,
  basename: process.env.VIC_UI_BASE ?? "/vic-ui/",
  routeDiscovery: { mode: "initial" },
  async prerender() {
    const paths = ["/", "/icons", "/api/search"];
    for await (const path of glob("**/*.mdx", { cwd: "content/docs" })) {
      paths.push(["/docs", ...getSlugs(path)].join("/"));
    }
    return paths;
  },
  async buildEnd({ reactRouterConfig }) {
    const output = join(reactRouterConfig.buildDirectory, "client");
    const prefix = reactRouterConfig.basename.replace(/^\/+|\/+$/g, "");
    // React Router #15000: prerender includes basename in output paths; Pages supplies it at the host.
    if (prefix) {
      await cp(join(output, "index.html"), join(output, "404.html"));
      await cp(join(output, prefix), output, { recursive: true });
      await rm(join(output, prefix), { recursive: true });
    } else {
      await cp(join(output, "__spa-fallback.html"), join(output, "404.html"));
    }
  },
} satisfies Config;
