import { useState } from "react";
import { CodeSnippet, Slider } from "vic-ui/ui";

export function SliderExample() {
  const [value, setValue] = useState(40);
  return <div className="not-prose grid gap-4">
    <div className="rounded-panel border bg-card p-8">
      <div className="mb-5 flex items-center justify-between text-sm"><span>Volume</span><output>{value}%</output></div>
      <Slider aria-label="Volume" value={value} onValueChange={(next) => setValue(Array.isArray(next) ? next[0]! : next)} />
    </div>
    <CodeSnippet filename="volume.tsx" code={'import { Slider } from "vic-ui/ui";\n\nexport function Volume() {\n  return <Slider aria-label="Volume" defaultValue={40} />;\n}'} />
  </div>;
}
