import { OrgMark } from "vic-ui";

export const title = "A logo in the letter's place";
export const note = "With src the picture fills the letter's box, contained. The letter stands until it has loaded and stays if it fails, so nothing changes size. useLogo draws the same over a tile of your own.";

const base = import.meta.env.BASE_URL;

export default function Example() {
  return (
    <div className="demo-row">
      <span className="demo-row">
        <OrgMark name="Halden" slug="halden" src={`${base}media/logo.svg`} />
        <OrgMark name="Halden" slug="halden" src={`${base}media/logo.svg`} size="lg" />
        <span className="demo-words">With a logo</span>
      </span>
      <span className="demo-row">
        <OrgMark name="Pellham" slug="pellham" src={`${base}media/missing.png`} />
        <OrgMark name="Pellham" slug="pellham" src={`${base}media/missing.png`} size="lg" />
        <span className="demo-words">A logo that fails keeps its letter</span>
      </span>
    </div>
  );
}
