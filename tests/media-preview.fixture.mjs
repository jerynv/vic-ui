import { createElement as h, useEffect, useState } from "react";
import { AudioPreview, VideoPreview } from "../dist/preview-media.js";

export function makeWav(seconds = 0.6) {
  const samples = Math.floor(seconds * 8000);
  const bytes = new Uint8Array(44 + samples * 2), view = new DataView(bytes.buffer);
  const word = (at, value) => { for (let i = 0; i < value.length; i++) bytes[at + i] = value.charCodeAt(i); };
  word(0, "RIFF"); view.setUint32(4, bytes.length - 8, true); word(8, "WAVE"); word(12, "fmt ");
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, 8000, true);
  view.setUint32(28, 16000, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); word(36, "data"); view.setUint32(40, samples * 2, true);
  for (let i = 0; i < samples; i++) view.setInt16(44 + i * 2, Math.sin(i * 2 * Math.PI * 440 / 8000) * 1500, true);
  return bytes;
}
const wav = makeWav();
const padded = new Uint8Array(wav.length + 8); padded.set(wav, 4);
const view = padded.subarray(4, padded.length - 4);
const wavBlob = new Blob([wav], { type: "audio/wav" });
const invalid = new Uint8Array([0, 1, 2, 3]);
const tooLarge = new Blob([new Uint8Array(64 * 1024 * 1024 + 1)], { type: "audio/wav" });

async function recordVideo() {
  const canvas = document.createElement("canvas"); canvas.width = 320; canvas.height = 180;
  const stream = canvas.captureStream(15), chunks = [];
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8" });
  const finished = new Promise((resolve, reject) => {
    recorder.addEventListener("dataavailable", event => { if (event.data.size) chunks.push(event.data); });
    recorder.addEventListener("stop", () => resolve(new Blob(chunks, { type: recorder.mimeType })), { once: true });
    recorder.addEventListener("error", reject, { once: true });
  });
  recorder.start();
  const context = canvas.getContext("2d");
  for (let n = 0; n < 12; n++) {
    context.fillStyle = n % 2 ? "#315c50" : "#24473e"; context.fillRect(0, 0, 320, 180);
    context.fillStyle = "#f4eee1"; context.font = "20px sans-serif"; context.fillText(`Local video ${n + 1}`, 70, 92);
    await new Promise(resolve => setTimeout(resolve, 70));
  }
  recorder.stop();
  try { return await finished; } finally { stream.getTracks().forEach(track => track.stop()); }
}

export function MediaPreviewFixture() {
  const [input, setInput] = useState(view);
  const [mimeType, setMimeType] = useState("audio/wav");
  const [maxBytes, setMaxBytes] = useState(undefined);
  const [mounted, setMounted] = useState(true);
  const [video, setVideo] = useState(null);
  const [errors, setErrors] = useState(0);
  const [videoError, setVideoError] = useState("");
  useEffect(() => {
    let current = true;
    recordVideo().then(blob => { if (current) { window.mediaFixtureVideo = blob; setVideo(blob); } }, error => { if (current) setVideoError(String(error)); });
    return () => { current = false; };
  }, []);
  const choose = (next, type = "audio/wav", max) => { setInput(next); setMimeType(type); setMaxBytes(max); setMounted(true); };
  return h("main", { style: { padding: 20, maxWidth: 800, margin: "auto" } },
    h("h1", null, "Ready media previews"),
    h("nav", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
      h("button", { id: "good", onClick: () => choose(view) }, "Array view"),
      h("button", { id: "blob", onClick: () => choose(wavBlob, undefined) }, "Blob input"),
      h("button", { id: "sniff", onClick: () => choose(view, "") }, "Native type sniffing"),
      h("button", { id: "invalid", onClick: () => choose(invalid) }, "Invalid media"),
      h("button", { id: "html", onClick: () => choose(view, "text/html") }, "Refuse HTML"),
      h("button", { id: "svg", onClick: () => choose(view, "image/svg+xml") }, "Refuse SVG"),
      h("button", { id: "wrong-kind", onClick: () => choose(view, "video/mp4") }, "Refuse wrong media kind"),
      h("button", { id: "small", onClick: () => choose(view, "audio/wav", view.byteLength - 1) }, "Lower budget"),
      h("button", { id: "exact", onClick: () => choose(view, "audio/wav", view.byteLength) }, "Exact budget"),
      h("button", { id: "oversized", onClick: () => choose(tooLarge, "audio/wav", 128 * 1024 * 1024) }, "Cannot raise hard budget"),
      h("button", { id: "unmount", onClick: () => setMounted(false) }, "Unmount players")),
    h("input", { id: "outside", "aria-label": "Outside media" }),
    h("output", { id: "errors" }, String(errors)),
    h("output", { id: "video-error" }, videoError),
    mounted ? h("section", { id: "audio", style: { marginTop: 16 } }, h(AudioPreview, { input, mimeType, maxBytes, title: "Recorded tone", onError: () => setErrors(value => value + 1) })) : null,
    mounted && video ? h("section", { id: "video", style: { marginTop: 16 } }, h(VideoPreview, { input: video, title: "Recorded canvas", onError: () => setErrors(value => value + 1) })) : null,
    h("button", { id: "play-audio", onClick: () => void document.querySelector("audio")?.play() }, "Play audio"),
    h("button", { id: "play-video", onClick: () => void document.querySelector("video")?.play() }, "Play video"));
}
