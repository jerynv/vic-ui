import defaultComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { SliderExample } from "./slider-example";
import { ComponentPreview } from "./component-preview";
import { lazy } from "react";

const LegacyCatalogue = lazy(() => import("./legacy-catalogue"));

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return { ...defaultComponents, SliderExample, ComponentPreview, LegacyCatalogue, ...components };
}
declare global { type MDXProvidedComponents = ReturnType<typeof useMDXComponents>; }
