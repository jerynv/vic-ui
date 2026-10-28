import { ButtonLink } from "vic-ui";
import { ArrowUpRightIcon } from "vic-ui/icons";

export const title = "A link drawn as a button";
export const note = "to goes through LinkProvider to your router; href is a plain anchor, and newTab opens it in a new tab.";

export default function Example() {
  return (
    <div className="demo-row">
      <ButtonLink to="#/colour" look="line">
        See the palette
      </ButtonLink>
      <ButtonLink href="https://react.dev" newTab look="quiet" icon={<ArrowUpRightIcon size={16} />}>
        React
      </ButtonLink>
    </div>
  );
}
