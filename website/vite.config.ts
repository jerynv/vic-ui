// Ported from Fumadocs' React Router SPA template (MIT, fuma-nama/fumadocs).
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  base: process.env.VIC_UI_BASE ?? "/vic-ui/",
  plugins: [fumadocsMdx(), tailwindcss(), reactRouter()],
  resolve: {
    alias: {
      "lucide-react": fileURLToPath(new URL("./app/lib/docs-icons.ts", import.meta.url)),
      "@": fileURLToPath(new URL("../src", import.meta.url)),
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "vic-ui/ui": fileURLToPath(new URL("../src/ui/index.ts", import.meta.url)),
      "vic-ui/icons": fileURLToPath(new URL("../src/icons/icons.tsx", import.meta.url)),
      "vic-ui": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
    },
    dedupe: ["react", "react-dom", "react-router", "@base-ui/react"],
  },
  ssr: { noExternal: ["fumadocs-core", "fumadocs-ui", "@fumadocs/base-ui"] },
  optimizeDeps: {
    // Scan lazy catalogue examples before serving a cold page (vite.dev/config/dep-optimization-options).
    entries: ["app/**/*.{ts,tsx}", "../src/**/*.{ts,tsx}", "../site/src/examples/**/*.tsx"],
    exclude: ["fumadocs-core", "fumadocs-ui"],
  },
});
