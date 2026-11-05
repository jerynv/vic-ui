import { createServer } from "vite";
import { fileURLToPath } from "node:url";
export async function startFixture() {
  const server = await createServer({
    configFile: false, root: fileURLToPath(new URL("..", import.meta.url)),
    cacheDir: "node_modules/.vite-canonical-tree-facts",
    optimizeDeps: { entries: ["tests/canonical-tree-facts.fixture.tsx"] },
    server: { host: "127.0.0.1", port: 0, watch: { ignored: ["**/website/build/**", "**/site/dist/**", "**/website/.react-router/**"] } },
    plugins: [{ name: "canonical-tree-facts", configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url, "http://localhost");
        if (url.pathname !== "/") return next();
        const sheet = url.searchParams.get("sheet") === "ui" ? "ui/styles.css" : "vic-ui.css";
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Facts and tree</title><link rel="stylesheet" href="/dist/${sheet}"></head><body><div id="root"></div><script type="module" src="/tests/canonical-tree-facts.fixture.tsx"></script></body></html>`);
      });
    } }],
  });
  await server.listen();
  return server;
}
