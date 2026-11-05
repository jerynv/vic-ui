import { useEffect, useState } from "react";
import { Player } from "vic-ui";
import { sampleWave } from "./sample";

export const title = "Native audio controls";
export const note = "A generated local tone. The host creates and releases the media URL.";
export default function PlayerExample() {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    const url = URL.createObjectURL(new Blob([sampleWave()], { type: "audio/wav" }));
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, []);
  return src ? <Player src={src} audio aria-label="Generated sample tone" /> : <p>Preparing the local tone.</p>;
}
