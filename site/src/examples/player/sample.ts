/** A short generated tone for this local example, not a remote recording. */
export function sampleWave(seconds = 0.7) {
  const count = Math.floor(seconds * 8000), bytes = new Uint8Array(44 + count * 2), data = new DataView(bytes.buffer);
  const word = (at: number, value: string) => { for (let i = 0; i < value.length; i++) bytes[at + i] = value.charCodeAt(i); };
  word(0, "RIFF"); data.setUint32(4, bytes.length - 8, true); word(8, "WAVE"); word(12, "fmt ");
  data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, 1, true); data.setUint32(24, 8000, true);
  data.setUint32(28, 16000, true); data.setUint16(32, 2, true); data.setUint16(34, 16, true); word(36, "data"); data.setUint32(40, count * 2, true);
  for (let i = 0; i < count; i++) data.setInt16(44 + i * 2, Math.sin(i * 2 * Math.PI * 440 / 8000) * 1500, true);
  return bytes;
}
