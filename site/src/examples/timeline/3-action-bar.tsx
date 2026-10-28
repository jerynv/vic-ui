import { ActionBar, ActionBarRule, IconButton } from "vic-ui";
import { CheckCircleIcon, CopyIcon, DotsThreeIcon, EyeIcon, ThumbsUpIcon } from "vic-ui/icons";

export const title = "The bar of actions over a message";

export default function Example() {
  return (
    <ActionBar aria-label="Message">
      <IconButton icon={<EyeIcon size={16} />} label="Seen" />
      <IconButton icon={<ThumbsUpIcon size={16} weight="fill" />} label="Agreed, take it back" aria-pressed />
      <IconButton icon={<CheckCircleIcon size={16} />} label="Done" />
      <ActionBarRule />
      <IconButton icon={<CopyIcon size={16} />} label="Copy the words" />
      <IconButton icon={<DotsThreeIcon size={16} />} label="More" />
    </ActionBar>
  );
}
