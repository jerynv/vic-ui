import { lazy, Suspense, use, useState } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { docs } from "../lib/source";
import { source } from "../lib/source.server";
import { baseOptions } from "../lib/layout";
import { useMDXComponents } from "../components/mdx";
import { redirect } from "react-router";
import { PIECES } from "../../../site/src/registry";
import registry from "../../../src/ui/registry.json";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "vic-ui/ui";
import { ChevronDownIcon, ChevronUpIcon } from "vic-ui/icons";
import { Surface, Select as SurfaceSelect, type SurfaceStyle } from "vic-ui";
const VicExamples = lazy(() => import("../components/vic-examples"));
import type { Route } from "./+types/docs";

export async function loader({ params }: Route.LoaderArgs) {
  if (params["*"].replace(/\/$/, "") === "compatibility") throw redirect("/docs/components/button");
  const page = source.getPage(params["*"].split("/").filter(Boolean));
  if (!page) throw new Response("Not found", { status: 404 });
  return { path: page.path, title: page.data.title, description: page.data.description, pageTree: await source.serializePageTree(source.getPageTree()) };
}

export function meta({ loaderData: data }: Route.MetaArgs) {
  return [{ title: `${data?.title ?? "Documentation"} · vic/ui` }, { name: "description", content: data?.description ?? "The vic/ui component library." }];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const [surface, setSurface] = useState<SurfaceStyle>("flat");
  const { path, pageTree } = useFumadocsLoader(loaderData);
  const page = docs.getPage(path);
  if (!page) throw new Error(`Unknown documentation page: ${path}`);
  const { toc } = use(page.load());
  const Content = page.body;
  const id = path.replace(/^components\//, "").replace(/\.mdx$/, "");
  const piece = path.startsWith("components/") ? PIECES.find(piece => piece.id === id) : undefined;
  const composable = registry.components.some(component => component.id === id);
  const hasSurface = ["text-field", "input", "textarea", "select", "native-select", "combobox", "number-field", "search-field", "date-picker", "input-group", "input-otp", "card"].includes(id);
  return <DocsLayout {...baseOptions()} tree={pageTree}><DocsPage toc={toc}>
    <DocsTitle>{page.title}</DocsTitle><DocsDescription>{piece?.summary ?? page.description}</DocsDescription>
    {hasSurface && <div className="mb-6 w-40"><SurfaceSelect size="sm" label="Preview surface" value={surface} items={{ flat: "Flat", bordered: "Bordered" }} onValueChange={value => setSurface(value as SurfaceStyle)} /></div>}
    <Surface surface={hasSurface ? surface : undefined}><DocsBody>
      {piece ? <Suspense fallback={<p>Loading examples…</p>}><VicExamples key={piece.id} name={piece.id} /></Suspense> : <Content components={useMDXComponents()} />}
      {piece && !composable && <Content components={useMDXComponents()} />}
      {piece && composable && <Collapsible key={id} className="not-prose mt-10 border-t pt-2">
        <CollapsibleTrigger className="ui-accordion-trigger group w-full">
          Composable API
          <ChevronDownIcon size={16} className="group-aria-expanded:hidden" />
          <ChevronUpIcon size={16} className="hidden group-aria-expanded:inline" />
        </CollapsibleTrigger>
        <CollapsibleContent className="prose"><Content components={useMDXComponents()} /></CollapsibleContent>
      </Collapsible>}
    </DocsBody></Surface>
  </DocsPage></DocsLayout>;
}
