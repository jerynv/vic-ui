import { useState } from "react";
import { TableOfContents } from "vic-ui";

export const title = "Sections in groups";

export default function Example() {
  const [current, setCurrent] = useState("#profile");
  return (
    <div style={{ width: "14rem" }}>
      <TableOfContents
        aria-label="Settings"
        current={current}
        onNavigate={(href, event) => {
          event.preventDefault();
          setCurrent(href);
        }}
        groups={[
          { heading: "You", entries: [{ href: "#profile", label: "Profile" }, { href: "#name", label: "Signing name" }, { href: "#appearance", label: "Appearance" }] },
          { heading: "Organisation", entries: [{ href: "#organisation", label: "Organisation" }, { href: "#features", label: "Features" }] },
          { entries: [{ href: "#a-long-one", label: "A section whose name is longer than its column" }] },
        ]}
      />
    </div>
  );
}
