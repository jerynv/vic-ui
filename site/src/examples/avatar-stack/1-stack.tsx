import { AvatarStack, OrgMark, hueFor } from "vic-ui";

export const title = "Faces, the rest counted";
export const note = "most caps how many are drawn; total counts the rest. Any element can be a face.";

const PEOPLE = ["Ada Lowe", "Ben Ito", "Cleo Marsh", "Dev Rao", "Eli Stone", "Fay Wu", "Gus Hale"];

function Face(props: { name: string }) {
  return (
    <span data-hue={hueFor(props.name)}>
      <span className="demo-face">{props.name.split(" ").map((part) => part[0])}</span>
    </span>
  );
}

export default function Example() {
  return (
    <div className="demo-wide">
      <AvatarStack label="Three people">
        {PEOPLE.slice(0, 3).map((name) => (
          <Face key={name} name={name} />
        ))}
      </AvatarStack>
      <AvatarStack label="Seven people, four shown" most={4}>
        {PEOPLE.map((name) => (
          <Face key={name} name={name} />
        ))}
      </AvatarStack>
      <AvatarStack label="Thirty people" size={32} total={30}>
        {PEOPLE.slice(0, 5).map((name) => (
          <Face key={name} name={name} />
        ))}
      </AvatarStack>
      <AvatarStack label="Organisations" size={32}>
        <OrgMark name="Halden Partners" slug="halden" />
        <OrgMark name="Northwind Club" slug="northwind" />
        <OrgMark name="Ashby School" slug="ashby" />
      </AvatarStack>
    </div>
  );
}
