import { useEffect, useState } from "react";
import { Progress } from "vic-ui";

export const title = "Known, unknown and toned";
export const note = "Without a value it is under way with no end known. valueText says how far in words.";

export default function Example() {
  const [done, setDone] = useState(3);
  useEffect(() => {
    const tick = window.setInterval(() => setDone((n) => (n >= 8 ? 0 : n + 1)), 1200);
    return () => window.clearInterval(tick);
  }, []);
  return (
    <div className="demo-stack">
      <Progress label="Uploading files" value={done} max={8} valueText={`${done} of 8 files`} />
      <Progress label="Storage used" value={62} />
      <Progress label="Preparing the export" />
      <Progress label="Export ready" value={100} valueText="Done" tone="settled" />
      <Progress label="Recording hours this month" value={9.4} max={10} valueText="9.4 of 10 hours, nearly at the limit" tone="caution" />
      <Progress label="Upload failed" value={40} valueText="Stopped at 40%" tone="danger" />
      <Progress label="Dense" size="sm" value={30} tone="moving" />
    </div>
  );
}
