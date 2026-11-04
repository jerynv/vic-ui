// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { CodeSnippet } from "vic-ui/ui";
export default function CodeBlockDemo() {
  return <CodeSnippet filename="hello.tsx" code={'import { Button } from "vic-ui/ui";\n\nexport function Hello() {\n  return <Button>Hello, world</Button>;\n}'} />;
}
