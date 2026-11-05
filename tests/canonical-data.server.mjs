import { createServer } from "vite";
import { fileURLToPath } from "node:url";

export async function startFixture(port = 0) {
  const server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL("..", import.meta.url)),
    cacheDir: "node_modules/.vite-canonical-data-test",
    optimizeDeps: { entries: ["tests/canonical-data.fixture.tsx"], include: ["react", "react-dom/client"] },
    server: { host: "127.0.0.1", port, strictPort: true, watch: { ignored: ["**/website/build/**", "**/site/dist/**", "**/website/.react-router/**"] } },
    plugins: [{ name: "canonical-data-fixture", configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url, "http://localhost");
        if (url.pathname !== "/") return next();
        const sheet = url.searchParams.get("sheet") === "ui" ? "ui/styles.css" : "../src/index.css";
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Controls and settings</title><link rel="stylesheet" href="${sheet.startsWith("..") ? "/src/index.css" : "/dist/" + sheet}"></head><body><div id="root"></div><script type="module" src="/tests/canonical-data.fixture.tsx"></script></body></html>`);
      });
    } }],
  });
  await server.listen();
  return server;
}
if (process.argv.includes("--serve")) {
  const server = await startFixture(4408);
  console.log(`Fixture: ${server.resolvedUrls.local[0]}; PID ${process.pid}`);
  for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, async () => { await server.close(); process.exit(0); });
}
