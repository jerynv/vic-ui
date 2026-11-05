import { createServer } from "vite";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
export async function startFixture(port = 0) {
  const server = await createServer({ configFile: false, root,
    cacheDir: "node_modules/.vite-canonical-focus-shell", optimizeDeps: { entries: ["tests/canonical-focus-shell.fixture.tsx"], include: ["motion/react"] },
    server: { host: "127.0.0.1", port, strictPort: true, watch: { ignored: ["**/website/build/**", "**/site/dist/**", "**/website/.react-router/**"] } },
    plugins: [{ name: "canonical-focus-shell", configureServer(server) { server.middlewares.use((request, response, next) => {
      const url = new URL(request.url, "http://localhost"); if (url.pathname !== "/") return next();
      const sheet = url.searchParams.get("sheet") === "ui" ? "ui/styles.css" : "vic-ui.css";
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(`<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Host document title</title><link rel="stylesheet" href="/dist/${sheet}"></head><body><div id="root"></div><script type="module" src="/tests/canonical-focus-shell.fixture.tsx"></script></body></html>`);
    }); } }],
  }); await server.listen(); return server;
}
