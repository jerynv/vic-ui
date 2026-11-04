import { use } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { docs } from "../lib/source";
import { source } from "../lib/source.server";
import { baseOptions } from "../lib/layout";
import { useMDXComponents } from "../components/mdx";
import type { Route } from "./+types/docs";

export async function loader({ params }: Route.LoaderArgs) {
  const page = source.getPage(params["*"].split("/").filter(Boolean));
  if (!page) throw new Response("Not found", { status: 404 });
  return { path: page.path, title: page.data.title, description: page.data.description, pageTree: await source.serializePageTree(source.getPageTree()) };
}

export function meta({ loaderData: data }: Route.MetaArgs) {
  return [{ title: `${data?.title ?? "Documentation"} · vic/ui` }, { name: "description", content: data?.description ?? "The vic/ui component library." }];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { path, pageTree } = useFumadocsLoader(loaderData);
  const page = docs.getPage(path);
  if (!page) throw new Error(`Unknown documentation page: ${path}`);
  const { toc } = use(page.load());
  const Content = page.body;
  return <DocsLayout {...baseOptions()} tree={pageTree}><DocsPage toc={toc}>
    <DocsTitle>{page.title}</DocsTitle><DocsDescription>{page.description}</DocsDescription>
    <DocsBody><Content components={useMDXComponents()} /></DocsBody>
  </DocsPage></DocsLayout>;
}
