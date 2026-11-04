import { useSearchParams } from "react-router";
import { CodeSnippet, Label, NativeSelect, NativeSelectOption, Tabs, TabsContent, TabsList, TabsTrigger } from "vic-ui/ui";
import { Toaster } from "vic-ui";
import { examplesOf } from "../../../site/src/examples";
import { PIECES } from "../../../site/src/registry";
import "../legacy.css";

export default function LegacyCatalogue() {
  const [params, setParams] = useSearchParams();
  const piece = PIECES.find(piece => piece.id === params.get("component")) ?? PIECES[0]!;
  return <div className="not-prose space-y-6">
    <div className="grid gap-2"><Label htmlFor="legacy-component">Original component</Label>
      <NativeSelect id="legacy-component" value={piece.id} onChange={event => setParams({ component: event.target.value }, { preventScrollReset: true })}>
        {PIECES.map(piece => <NativeSelectOption key={piece.id} value={piece.id}>{piece.name}</NativeSelectOption>)}
      </NativeSelect>
    </div>
    <div><h2 className="mb-2 text-2xl font-semibold">{piece.name}</h2><p className="text-muted-foreground">{piece.summary}</p></div>
    <p className="text-sm">Exports: <code>{piece.exports.join(", ")}</code></p>
    {examplesOf(piece.id).map(({ key, title, note, Demo, code }) => <section key={key} className="space-y-3">
      <h3 className="text-lg font-medium">{title}</h3>{note && <p className="text-sm text-muted-foreground">{note}</p>}
      <Tabs defaultValue="preview"><TabsList variant="line"><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="source">Source</TabsTrigger></TabsList>
        <TabsContent value="preview" className="legacy-preview min-w-0 overflow-auto rounded-(--radius-panel) border bg-card p-6"><Demo /></TabsContent>
        <TabsContent value="source"><CodeSnippet code={code} filename={key.split("/").at(-1)!} className="max-h-[36rem] overflow-auto" /></TabsContent>
      </Tabs>
    </section>)}
    <Toaster />
  </div>;
}
