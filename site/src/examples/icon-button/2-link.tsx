import { IconButtonLink } from "vic-ui";
import { DownloadSimpleIcon, GearIcon } from "vic-ui/icons";

export const title = "An icon alone on a link";
export const note = "The same square button, drawn on a link inside the application (to) or a download (href); its words are its name and its tooltip.";

export default function Example() {
  return (
    <div className="demo-row">
      <IconButtonLink look="line" to="#/icon-button" icon={<GearIcon size={16} />} label="Settings" />
      <IconButtonLink href="data:text/plain,Hello" download="hello.txt" icon={<DownloadSimpleIcon size={16} />} label="Download hello.txt" />
    </div>
  );
}
