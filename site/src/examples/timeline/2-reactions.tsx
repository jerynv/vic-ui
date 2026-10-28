import { useState } from "react";
import { Reaction, Reactions } from "vic-ui";
import { CheckCircleIcon, EyeIcon, ThumbsUpIcon } from "vic-ui/icons";

export const title = "What people said back";
export const note = "A reaction the reader gave is pressed; its tip says who.";

export default function Example() {
  const [seen, setSeen] = useState(true);
  return (
    <Reactions>
      <Reaction icon={<EyeIcon size={13} weight={seen ? "fill" : "regular"} />} label="Seen" count={seen ? 3 : 2} pressed={seen} onPress={() => setSeen(!seen)} tip="Seen by Ana, Omar and you" />
      <Reaction icon={<ThumbsUpIcon size={13} />} label="Agreed" count={1} pressed={false} onPress={() => {}} tip="Agreed by Lena" />
      <Reaction icon={<CheckCircleIcon size={13} />} label="Done" count={12} pressed={false} onPress={() => {}} />
    </Reactions>
  );
}
