import defaultComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentPreview } from "./component-preview";
import { lazy } from "react";

const IconCatalogue = lazy(() => import("./icon-catalogue"));

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return { ...defaultComponents, ComponentPreview, IconCatalogue, ...components };
}
declare global { type MDXProvidedComponents = ReturnType<typeof useMDXComponents>; }
