import { CodeSnippet, Tabs, TabsContent, TabsList, TabsTrigger } from "vic-ui/ui";
import { Toaster } from "vic-ui";
import { examplesOf } from "../../../site/src/examples";
import { PIECES } from "../../../site/src/registry";
import "../examples.css";

export default function VicExamples({ name }: { name: string }) {
  const piece = PIECES.find(piece => piece.id === name);
  if (!piece) throw new Error(`Unknown component: ${name}`);
  return <div className="not-prose space-y-6">
    <CodeSnippet code={`import { ${piece.exports.join(", ")} } from "vic-ui";`} filename="Import" />
    <p className="text-sm"><a className="underline underline-offset-4" href={`https://github.com/jerynv/vic-ui/blob/main/src/components/${piece.file}`}>Props and component source</a></p>
    {examplesOf(piece.id).map(({ key, title, note, Demo, code }) => <section key={key} data-vic-example={key} className="space-y-3">
      <h3 className="text-lg font-medium">{title}</h3>{note && <p className="text-sm text-muted-foreground">{note}</p>}
      <Tabs defaultValue="preview"><TabsList variant="line"><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="source">Source</TabsTrigger></TabsList>
        <TabsContent value="preview" className="vic-preview min-w-0 overflow-auto rounded-(--radius-panel) border bg-card p-6"><Demo /></TabsContent>
        <TabsContent value="source"><CodeSnippet code={code} filename={key.split("/").at(-1)!} className="max-h-[36rem] overflow-auto" /></TabsContent>
      </Tabs>
    </section>)}
    <Toaster />
  </div>;
}
