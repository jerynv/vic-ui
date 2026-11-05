import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import packageJson from "./package.json" with { type: "json" };

/** The package: ESM only, React and Floating UI left to the consumer, the CSS built apart (`scripts/build-css.mjs`). */
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: { index: "src/index.ts", icons: "src/icons/icons.tsx", ui: "src/ui/index.ts", "preview-media": "src/preview/media/index.ts", "preview-office": "src/preview/office/index.ts", "preview-docx": "src/preview/docx/index.ts" },
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) => [...Object.keys(packageJson.peerDependencies), ...Object.keys(packageJson.dependencies)].some((name) => id === name || id.startsWith(`${name}/`)),
      output: { preserveModules: false },
    },
  },
});
