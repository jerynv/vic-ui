import { MediaGrid, type MediaItem } from "vic-ui";

export const title = "One picture, of known and unknown shape";
export const note = "Each box takes its size from the width and height it was told before its bytes arrive. One of unknown shape keeps a fixed box; one that fails says so.";

const base = import.meta.env.BASE_URL;
const picture = (key: string, file: string, width: number | null, height: number | null): MediaItem => ({ key, kind: "image", src: `${base}media/${file}`, alt: key, width, height, onOpen: () => {} });

export default function Example() {
  return (
    <div className="demo-wide">
      <MediaGrid items={[picture("Wide", "wide.svg", 1536, 1024)]} />
      <MediaGrid items={[picture("Tall", "tall.svg", 640, 960)]} />
      <MediaGrid items={[picture("Unknown shape", "square.svg", null, null)]} />
      <MediaGrid items={[picture("Missing", "not-there.svg", 800, 500)]} />
    </div>
  );
}
