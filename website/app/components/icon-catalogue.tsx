import { useEffect, useState } from "react";
import { TextField, Button } from "vic-ui";
import * as icons from "vic-ui/icons";
import registry from "../../../src/icons/registry.json";

export default function IconCatalogue() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const matches = registry.filter(icon => `${icon.name} ${icon.source}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="not-prose space-y-4">
    <TextField disabled={!ready} label="Find an icon" placeholder="Search by name or source…" value={query} onChange={event => setQuery(event.target.value)} />
    <p className="text-sm text-muted-foreground" role="status">{copied ? `Copied ${copied}` : `${matches.length} icons`}</p>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Icon catalogue">
      {matches.map(({ name, source }) => {
        const Glyph = icons[name as keyof typeof icons];
        return <div key={name} className="ui-card ui-card-lifted grid min-w-0 justify-items-start gap-3 p-4">
          <Glyph size={24} /><span className="max-w-full break-all text-sm">{name}</span>
          <span className="text-xs text-muted-foreground">{source.split(":")[0]}</span>
          <Button look="quiet" aria-label={`Copy ${name} import`} onClick={() => {
            navigator.clipboard.writeText(`import { ${name} } from "vic-ui/icons";`).then(() => setCopied(name)).catch(() => setCopied(""));
          }}>Copy import</Button>
        </div>;
      })}
    </div>
  </div>;
}
