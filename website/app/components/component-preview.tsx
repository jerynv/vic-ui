import { lazy, Suspense, useEffect, useState, type ComponentType } from "react";
import { CodeSnippet, Skeleton, Tabs, TabsContent, TabsList, TabsTrigger } from "vic-ui/ui";

const modules = import.meta.glob<{ default: ComponentType }>("../examples/*.tsx");
const examples = Object.fromEntries(Object.entries(modules).map(([path, load]) => [path, lazy(load)]));
const sources = import.meta.glob<string>("../examples/*.tsx", { query: "?raw", import: "default" });

export function ComponentPreview({ name }: { name: string }) {
  const path = `../examples/${name}.tsx`;
  const Example = examples[path];
  const [code, setCode] = useState("");
  useEffect(() => {
    let active = true;
    setCode("");
    sources[path]?.().then(source => { if (active) setCode(source); });
    return () => { active = false; };
  }, [path]);
  if (!Example) throw new Error(`Missing component example: ${name}`);
  return <Tabs data-vic-example={name} defaultValue="preview" className="not-prose my-6 min-w-0 gap-3">
    <TabsList aria-label={`${name} example`} variant="line">
      <TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="source">Source</TabsTrigger>
    </TabsList>
    <TabsContent value="preview" className="preview-canvas relative isolate flex min-h-64 min-w-0 items-center justify-center overflow-hidden rounded-(--radius-panel) border bg-card p-6 sm:p-10" aria-label={`${name} preview`}>
      <Suspense fallback={<Skeleton className="h-32 w-full" />}><Example /></Suspense>
    </TabsContent>
    <TabsContent value="source" className="min-w-0">
      {code ? <CodeSnippet filename={`${name}.tsx`} code={code} className="max-h-[36rem] overflow-auto" /> : <Skeleton className="h-64 w-full" />}
    </TabsContent>
  </Tabs>;
}
