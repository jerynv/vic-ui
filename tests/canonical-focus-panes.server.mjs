import { createServer } from "vite";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
export async function startFixture(port = 0) {
  const server = await createServer({
    configFile: false, root, resolve: { alias: { "@": `${root}/src` } },
    cacheDir: "node_modules/.vite-canonical-focus-panes",
    optimizeDeps: { entries: ["tests/canonical-focus-panes.fixture.tsx"] },
    server: { host: "127.0.0.1", port, strictPort: true, watch: { ignored: ["**/website/build/**", "**/site/dist/**", "**/website/.react-router/**"] } },
    plugins: [{ name: "canonical-focus-panes", configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url, "http://localhost");
        if (url.pathname !== "/") return next();
        const sheet = url.searchParams.get("sheet") === "ui" ? "ui/styles.css" : "vic-ui.css";
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Canonical focus controls</title><link rel="stylesheet" href="/dist/${sheet}"></head><body><div id="root"></div><script type="module" src="/tests/canonical-focus-panes.fixture.tsx"></script></body></html>`);
      });
    } }],
  });
  await server.listen(); return server;
}
if (process.argv.includes("--serve")) {
  const server = await startFixture(4397); console.log(`Fixture: ${server.resolvedUrls.local[0]}; PID ${process.pid}`);
  for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, async () => { await server.close(); process.exit(0); });
}
