import defaultComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { SliderExample } from "./slider-example";

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return { ...defaultComponents, SliderExample, ...components };
}
declare global { type MDXProvidedComponents = ReturnType<typeof useMDXComponents>; }
