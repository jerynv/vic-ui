import { lazy, Suspense, use, useEffect, useState } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { docs } from "../lib/source";
import { source } from "../lib/source.server";
import { baseOptions } from "../lib/layout";
import { useMDXComponents } from "../components/mdx";
import { redirect, useHref, useLocation } from "react-router";
import { PIECES } from "../../../site/src/registry";
import registry from "../../../src/ui/registry.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "vic-ui/ui";
import { canonicalComponentId, canonicalDocPath } from "../lib/component-families";
import { Surface, Select as SurfaceSelect, type SurfaceStyle } from "vic-ui";
const VicExamples = lazy(() => import("../components/vic-examples"));
import type { Route } from "./+types/docs";

export async function loader({ params }: Route.LoaderArgs) {
  if (params["*"].replace(/\/$/, "") === "compatibility") throw redirect("/docs/components/button");
  const requested = params["*"].replace(/\/$/, "");
  const canonical = canonicalDocPath(requested);
  const page = source.getPage(canonical.split("/").filter(Boolean));
  if (!page) throw new Response("Not found", { status: 404 });
  return { path: page.path, title: page.data.title, description: page.data.description, alias: requested !== canonical, canonicalUrl: `${page.url}/`, pageTree: await source.serializePageTree(source.getPageTree()) };
}

export function meta({ loaderData: data }: Route.MetaArgs) {
  return [{ title: `${data?.title ?? "Documentation"} · vic/ui` }, { name: "description", content: data?.description ?? "The vic/ui component library." }];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const [surface, setSurface] = useState<SurfaceStyle>("flat");
  const location = useLocation();
  const canonicalHref = useHref(`${loaderData.canonicalUrl}${location.search}${location.hash}`);
  const [api, setApi] = useState("ready-made");
  useEffect(() => setApi(location.hash ? "composable" : "ready-made"), [loaderData.path, location.hash]);
  useEffect(() => {
    // Static hosts serve document directories; a full redirect avoids slash-specific data requests.
    if (loaderData.alias) window.location.replace(canonicalHref);
  }, [loaderData.alias, canonicalHref]);
  const { path, pageTree } = useFumadocsLoader(loaderData);
  const page = docs.getPage(path);
  if (!page) throw new Error(`Unknown documentation page: ${path}`);
  const { toc } = use(page.load());
  const Content = page.body;
  const id = path.replace(/^components\//, "").replace(/\.mdx$/, "");
  const piece = path.startsWith("components/") ? PIECES.find(piece => canonicalComponentId(piece.id) === id) : undefined;
  const composable = registry.components.some(component => component.id === id);
  const hasSurface = ["input", "textarea", "select", "native-select", "combobox", "number-field", "search-field", "date-picker", "input-group", "input-otp", "card"].includes(id);
  return <DocsLayout {...baseOptions(true)} tree={pageTree}><DocsPage toc={piece && composable && api === "ready-made" ? [] : toc}>
    <DocsTitle>{page.title}</DocsTitle><DocsDescription>{piece?.id === id ? piece.summary : page.description}</DocsDescription>
    {hasSurface && <div className="mb-6 w-40"><SurfaceSelect size="sm" label="Preview surface" value={surface} items={{ flat: "Flat", bordered: "Bordered" }} onValueChange={value => setSurface(value as SurfaceStyle)} /></div>}
    <Surface surface={hasSurface ? surface : undefined}><DocsBody>
      {piece && composable ? <Tabs value={api} onValueChange={setApi}>
        <TabsList aria-label="Component API" variant="line" className="mb-4">
          <TabsTrigger value="ready-made">Ready-made</TabsTrigger><TabsTrigger value="composable">Composable</TabsTrigger>
        </TabsList>
        <TabsContent value="ready-made"><Suspense fallback={<p>Loading examples…</p>}><VicExamples key={piece.id} name={piece.id} /></Suspense></TabsContent>
        <TabsContent value="composable"><Content components={useMDXComponents()} /></TabsContent>
      </Tabs> : <>{piece && <Suspense fallback={<p>Loading examples…</p>}><VicExamples key={piece.id} name={piece.id} /></Suspense>}<Content components={useMDXComponents()} /></>}
    </DocsBody></Surface>
  </DocsPage></DocsLayout>;
}
