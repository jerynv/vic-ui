import defaultComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentPreview } from "./component-preview";

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return { ...defaultComponents, ComponentPreview, ...components };
}
declare global { type MDXProvidedComponents = ReturnType<typeof useMDXComponents>; }
