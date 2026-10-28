import { HUES, OrgMark, hueFor } from "vic-ui";

export const title = "Marks, and the five hues";
export const note = "hueFor hashes what names a place, so it is the same colour everywhere it appears.";

const PLACES = ["Aperture", "Halden", "Kestrel ridge", "Morrow vale", "Pellham", "Northwind"];

export default function Example() {
  return (
    <div className="demo-wide">
      <div className="demo-row">
        {PLACES.map((name) => {
          const slug = name.toLowerCase().replace(/ /g, "-");
          return (
            <span key={slug} className="demo-row">
              <OrgMark name={name} slug={slug} />
              <OrgMark name={name} slug={slug} size="lg" />
              <span className="demo-words">
                {name}, {hueFor(slug)}
              </span>
            </span>
          );
        })}
      </div>
      <div className="demo-row">
        {HUES.map((hue) => (
          <span key={hue} data-hue={hue} style={{ background: "var(--hue)", color: "var(--hue-ink)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-control)" }}>
            {hue}
          </span>
        ))}
      </div>
    </div>
  );
}
