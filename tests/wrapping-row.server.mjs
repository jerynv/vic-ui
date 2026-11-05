import { createServer } from "vite";
import { fileURLToPath } from "node:url";
export async function startFixture() {
  const server = await createServer({
    configFile: false, root: fileURLToPath(new URL("..", import.meta.url)),
    cacheDir: "node_modules/.vite-wrapping-row",
    optimizeDeps: { entries: ["tests/wrapping-row.fixture.tsx"] },
    server: { host: "127.0.0.1", port: 0, watch: { ignored: ["**/website/build/**", "**/site/dist/**", "**/website/.react-router/**"] } },
    plugins: [{ name: "wrapping-row", configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url, "http://localhost");
        if (url.pathname !== "/") return next();
        const sheet = url.searchParams.get("sheet") === "ui" ? "ui/styles.css" : "vic-ui.css";
        const reference = url.searchParams.has("reference");
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<!doctype html><html lang="en" ${reference ? 'data-reference="true"' : ''}><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Wrapping rows</title><style>@layer properties, theme, base, components, utilities; @layer components.parts, components.console;</style><link rel="stylesheet" href="/dist/${sheet}"><link rel="stylesheet" href="/src/styles/tokens.css"><link rel="stylesheet" href="${reference ? '/tests/wrapping-row.reference.css' : '/src/styles/components/ui-wrapping-row.css'}"></head><body><div id="root"></div><script type="module" src="/tests/wrapping-row.fixture.tsx"></script></body></html>`);
      });
    } }],
  });
  await server.listen(); return server;
}
