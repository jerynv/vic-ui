import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "../src/components/Player";
import { PlacePicker, type PlaceValue } from "../src/components/PlacePicker";
import { Button } from "../src/components/Button";
import { sampleWave } from "../site/src/examples/player/sample";
import "../src/styles/components/ui-canonical-player-place.css";
import "./canonical-player-place.fixture.css";
const spaces = [{ id: "studio", name: "Studio", whole: true }, { id: "operations", name: "Operations", whole: false }, { id: "empty", name: "Empty space", whole: false }];
const projects = [{ id: "guide", name: "Field guide", spaceId: "studio" }, { id: "planning", name: "Planning", spaceId: "operations" }];
declare global { interface Window { playerURL?: string; videoURL?: string; lastMedia?: HTMLMediaElement | null; } }
function Fixture() {
  const [value, setValue] = useState<PlaceValue>({ spaceId: "studio", projectId: "guide" });
  const [accept, setAccept] = useState(true), [requests, setRequests] = useState(0);
  const [src, setSrc] = useState<string | null>(null), [mounted, setMounted] = useState(true), [errors, setErrors] = useState(0), [time, setTime] = useState(-1);
  const [video, setVideo] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement & HTMLVideoElement>(null), picture = useRef<HTMLAudioElement & HTMLVideoElement>(null);
  useEffect(() => {
    const url = URL.createObjectURL(new Blob([sampleWave(1.2)], { type: "audio/wav" }));
    window.playerURL = url; setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, []);
  return <main>
    <h1>Places and native media</h1>
    <section>
      <PlacePicker aria-label="Location" label="Location" value={value} spaces={spaces} projects={projects} organization onValueChange={next => { setRequests(n => n + 1); if (accept) setValue(next); }} />
      <output data-location>{value.spaceId}/{value.projectId ?? ""}</output><output data-requests>{requests}</output>
      <Button look="line" onClick={() => setAccept(!accept)} aria-pressed={!accept}>Hold location</Button>
      <PlacePicker aria-label="Unavailable location" label="Unavailable" value={value} spaces={spaces} projects={projects} organization disabled onValueChange={() => setRequests(n => n + 1)} />
      <PlacePicker aria-label="Explained location" label="Held with a reason" value={value} spaces={spaces} projects={projects} organization disabled disabledReason="Choose an available workspace first." onValueChange={() => setRequests(n => n + 1)} />
      <PlacePicker aria-label="Thin location" size="xs" value={value} spaces={spaces} projects={projects} organization onValueChange={setValue} />
      <PlacePicker aria-label="Empty location" value={{ spaceId: "missing", projectId: null }} spaces={[]} projects={[]} organization={false} onValueChange={() => {}} />
      <PlacePicker aria-label="Retained location" size="sm" value={{ spaceId: "retained", projectId: "old" }} spaces={[]} projects={[]} organization={false} now={{ space: { id: "retained", name: "Retained space" }, project: { id: "old", name: "Earlier project" } }} onValueChange={setValue} />
    </section>
    <section aria-label="Media examples">
      {mounted && src && <Player src={src} audio ref={audio} onTime={setTime} onError={() => setErrors(n => n + 1)} aria-label="Generated tone" />}
      {mounted && video && <Player src={video} ref={picture} aria-label="Generated video" onError={() => setErrors(n => n + 1)} />}
      <output data-time>{time}</output><output data-errors>{errors}</output>
      <div className="fixture-actions">
        <Button look="line" onClick={() => void audio.current?.play()}>Play tone</Button>
        <Button look="line" onClick={() => void picture.current?.play()}>Play video</Button>
        <Button look="line" onClick={() => setVideo(window.videoURL ?? null)}>Load generated video</Button>
        <Button look="line" onClick={() => setSrc("/invalid-media")}>Invalid media</Button>
        <Button look="line" onClick={() => setSrc(window.playerURL ?? null)}>Restore media</Button>
        <Button look="line" onClick={() => { window.lastMedia = audio.current; setMounted(false); }}>Unmount players</Button>
      </div>
    </section>
    <button type="button">After examples</button>
  </main>;
}
const query = new URLSearchParams(location.search);
document.documentElement.dataset.mode = query.get("theme") ?? "light";
createRoot(document.getElementById("root")!).render(<Fixture />);
