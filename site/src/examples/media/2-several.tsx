import { MediaGrid, type MediaItem } from "vic-ui";

export const title = "Several";
export const note = "Past four, the last tile says how many more.";

const base = import.meta.env.BASE_URL;
const FILES = ["band.svg", "narrow.svg", "wide.svg", "square.svg", "tall.svg", "band.svg"];
const pictures = (count: number): MediaItem[] => FILES.slice(0, count).map((file, at) => ({ key: `${at}`, kind: "image", src: `${base}media/${file}`, alt: `Picture ${at + 1}`, width: 960, height: 539, onOpen: () => {} }));

export default function Example() {
  return (
    <div className="demo-wide">
      <MediaGrid items={pictures(2)} />
      <MediaGrid items={pictures(3)} />
      <MediaGrid items={pictures(6)} />
    </div>
  );
}
