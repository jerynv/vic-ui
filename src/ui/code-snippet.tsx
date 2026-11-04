import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLine, CodeBlockTitle } from "./code-block";
import { useHighlightedCode } from "./hooks/use-highlighted-code";

/** shadcn CodeBlock and its lazy Shiki highlighter, ready for documentation examples. */
export function CodeSnippet({ code, language = "tsx", filename, className }: { code: string; language?: string; filename?: string; className?: string }) {
  const lines = useHighlightedCode(code, language);
  return (
    <CodeBlock className={className}>
      <CodeBlockHeader>
        <CodeBlockTitle>{filename ?? language}</CodeBlockTitle>
        <CodeBlockActions><CodeBlockCopyButton value={code} /></CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers>
        {lines.map((line, index) => <CodeBlockLine key={index}>{line}</CodeBlockLine>)}
      </CodeBlockContent>
    </CodeBlock>
  );
}
