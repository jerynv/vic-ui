// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { TypographyH2, TypographyLead, TypographyP, TypographyBlockquote, TypographyInlineCode, TypographyMuted } from "vic-ui/ui";
export default function TypographyDemo() {
  return <article className="max-w-md">
    <TypographyH2>A place for every idea.</TypographyH2>
    <TypographyLead>Good interfaces give content room to breathe.</TypographyLead>
    <TypographyP>Start with a clear hierarchy. Use <TypographyInlineCode>Typography</TypographyInlineCode> to keep headings and body copy consistent.</TypographyP>
    <TypographyBlockquote>Make the important thing easy to find.</TypographyBlockquote>
    <TypographyMuted>Cal Sans UI and Space Mono, included in the library.</TypographyMuted>
  </article>;
}
