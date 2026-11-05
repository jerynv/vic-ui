import { createServer } from "vite";
import { fileURLToPath } from "node:url";

export async function startFixture(port = 0) {
  const server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL("..", import.meta.url)),
    cacheDir: "node_modules/.vite-controls-layout-test",
    optimizeDeps: { entries: ["tests/controls-layout.fixture.tsx"] },
    server: { host: "127.0.0.1", port, strictPort: true },
    plugins: [{ name: "controls-layout-fixture", configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (new URL(request.url, "http://localhost").pathname !== "/") return next();
        response.setHeader("Content-Type", "text/html");
        response.end('<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Controls and settings</title></head><body><div id="root"></div><script type="module" src="/tests/controls-layout.fixture.tsx"></script></body></html>');
      });
    } }],
  });
  await server.listen();
  return server;
}
if (process.argv.includes("--serve")) {
  const server = await startFixture(4399);
  console.log(`Fixture: ${server.resolvedUrls.local[0]}; PID ${process.pid}`);
  for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, async () => { await server.close(); process.exit(0); });
}
