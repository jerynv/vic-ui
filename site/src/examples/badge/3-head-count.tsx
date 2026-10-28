import { HeadCount } from "vic-ui";

export const title = "A heading's count";
export const note = "HeadCount is a quiet number after a heading's words, read with the heading, so it needs no words of its own. A count waiting for somebody is Count.";

export default function Example() {
  return (
    <div className="demo-stack">
      <h3 style={{ margin: 0, fontSize: "var(--text-ui)", fontWeight: 600 }}>
        Comments <HeadCount value={4} />
      </h3>
      <h3 style={{ margin: 0, fontSize: "var(--text-ui)", fontWeight: 600 }}>
        In it <HeadCount value={12} />
      </h3>
    </div>
  );
}
