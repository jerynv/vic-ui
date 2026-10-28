import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

/**
 * The documentation site: static files for GitHub Pages under a project path. The path is
 * `VIC_UI_BASE` (default `/vic-ui/`); pages are routed by the hash, so no server rewrite is
 * needed. The site reads the library from source, so what it shows is what ships.
 */
export default defineConfig({
  root: here("."),
  base: process.env.VIC_UI_BASE ?? "/vic-ui/",
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^vic-ui\/icons$/, replacement: here("../src/icons/icons.tsx") },
      { find: /^vic-ui\/styles\.css$/, replacement: here("../src/index.css") },
      { find: /^vic-ui$/, replacement: here("../src/index.ts") },
    ],
  },
  build: {
    outDir: here("dist"),
    emptyOutDir: true,
  },
});
