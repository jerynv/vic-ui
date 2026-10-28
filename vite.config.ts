import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** The package: ESM only, React and Floating UI left to the consumer, the CSS built apart (`scripts/build-css.mjs`). */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: { index: "src/index.ts", icons: "src/icons/icons.tsx" },
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@floating-ui\//],
      output: { preserveModules: false },
    },
  },
});
