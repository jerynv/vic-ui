import { createServer } from "vite";
import { fileURLToPath } from "node:url";
export async function startFixture(port = 0) {
  const server = await createServer({ configFile: false, root: fileURLToPath(new URL("..", import.meta.url)), cacheDir: "node_modules/.vite-canonical-time-test",
    optimizeDeps: { entries: ["tests/canonical-time.fixture.tsx"] },
    server: { host: "127.0.0.1", port, strictPort: true, watch: { ignored: ["**/website/**", "**/site/**", "**/dist/**"] } },
    plugins: [{ name: "canonical-time-fixture", configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url, "http://localhost"); if (url.pathname !== "/") return next();
        const sheet = url.searchParams.get("sheet") === "ui" ? "/dist/ui/styles.css" : "/src/index.css";
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Canonical time</title><link rel="stylesheet" href="${sheet}"><link rel="stylesheet" href="/src/styles/tokens.css"><link rel="stylesheet" href="/src/styles/components/ui-canonical-controls.css"><link rel="stylesheet" href="/src/styles/components/ui-canonical-time.css"></head><body><div id="root"></div><script type="module" src="/tests/canonical-time.fixture.tsx"></script></body></html>`);
      });
    } }],
  }); await server.listen(); return server;
}
