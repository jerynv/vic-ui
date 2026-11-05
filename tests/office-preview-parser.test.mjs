import assert from "node:assert/strict";
import test from "node:test";
import { readOfficeArchive, OFFICE_LIMITS, parseOfficeXml } from "../src/preview/office/zip.ts";
import { officeZip, encoded } from "./office-zip.fixture.mjs";

const central = bytes => { const view = new DataView(bytes.buffer); return view.getUint32(bytes.length - 6, true); };
const mutate = (bytes, fn) => { const copy = bytes.slice(); fn(new DataView(copy.buffer), central(copy)); return copy; };
test("Office ZIP validates stored/deflated/data-descriptor payloads and exact views", async () => {
  for (const compress of [false, true]) for (const descriptor of [false, true]) {
    const bytes = officeZip({ "word/document.xml": "<document>Words</document>", "empty/": "" }, { compress, descriptor });
    const padded = new Uint8Array(bytes.length + 12); padded.set(bytes, 5);
    const archive = await readOfficeArchive(padded.subarray(5, 5 + bytes.length));
    assert.equal(new TextDecoder().decode(archive.get("word/document.xml")), "<document>Words</document>");
    assert.equal(archive.size, 1);
  }
});
test("Office ZIP rejects encoded, claimed, actual inflation and archive-structure violations", async () => {
  let read = false;
  class Observed extends Blob { arrayBuffer() { read = true; return super.arrayBuffer(); } }
  await assert.rejects(readOfficeArchive(new Observed([new Uint8Array(100)]), { maxBytes: 20 }), /encoded bytes/);
  assert.equal(read, false);
  const good = officeZip({ "a.xml": "<a/>" });
  for (const name of ["../a", "/a", "a/../b", "a\\b", "C:a", "a//b", "a%2fb", "a\u0000b"]) await assert.rejects(readOfficeArchive(officeZip({ [name]: "x" })), /paths/);
  await assert.rejects(readOfficeArchive(officeZip([["a", "x"], ["a", "y"]])), /unique/);
  await assert.rejects(readOfficeArchive(mutate(good, (v, cd) => v.setUint32(cd + 24, OFFICE_LIMITS.maxPartBytes + 1, true))), /expanded budget/);
  await assert.rejects(readOfficeArchive(mutate(good, (v, cd) => v.setUint16(cd + 8, 1, true))), /Encrypted/);
  await assert.rejects(readOfficeArchive(mutate(good, v => v.setUint16(good.length - 18, 1, true))), /Multi-volume/);
  await assert.rejects(readOfficeArchive(mutate(good, (v, cd) => v.setUint32(cd + 42, 0xffffffff, true))), /ZIP64/);
  await assert.rejects(readOfficeArchive(mutate(good, (v, cd) => v.setUint32(cd + 42, cd - 2, true))), /local record/);
  await assert.rejects(readOfficeArchive(mutate(good, v => v.setUint8(30, 98))), /local name/);
  await assert.rejects(readOfficeArchive(mutate(good, v => v.setUint8(35, 0))), /checksum/);
  const duplicateOffset = officeZip({ "a.xml": "<a/>", "b.xml": "<b/>" });
  await assert.rejects(readOfficeArchive(mutate(duplicateOffset, (v, cd) => v.setUint32(cd + 51 + 42, 0, true))), /local name|overlap/);
  await assert.rejects(readOfficeArchive(officeZip(Object.fromEntries(Array.from({ length: 513 }, (_, i) => [`p${i}`, ""])) )), /512/);
  const aggregate = officeZip(Object.fromEntries(Array.from({ length: 5 }, (_, i) => [`p${i}`, new Uint8Array(7 * 1024 * 1024)])), { compress: true });
  await assert.rejects(readOfficeArchive(aggregate), /32 MiB/);
  const bomb = officeZip({ "bomb.xml": new Uint8Array(200_000) }, { compress: true });
  const lying = mutate(bomb, (v, cd) => { v.setUint32(cd + 24, 1, true); v.setUint32(22, 1, true); });
  await assert.rejects(readOfficeArchive(lying), /expands beyond/);
});
test("Office ZIP cancellation and XML preparse budgets are enforced", async () => {
  const controller = new AbortController(); controller.abort();
  await assert.rejects(readOfficeArchive(officeZip({ a: "x" }), undefined, controller.signal), { name: "AbortError" });
  const duringInflation = new AbortController();
  const pending = readOfficeArchive(officeZip({ large: new Uint8Array(OFFICE_LIMITS.maxPartBytes) }, { compress: true }), undefined, duringInflation.signal);
  queueMicrotask(() => duringInflation.abort());
  await assert.rejects(pending, { name: "AbortError" });
  assert.throws(() => parseOfficeXml(encoded('<!DOCTYPE r [<!ENTITY a "x">]><r>&a;</r>')), /entities/);
  assert.throws(() => parseOfficeXml(new Uint8Array(OFFICE_LIMITS.maxXmlBytes + 1)), /4 MiB/);
  assert.throws(() => parseOfficeXml(encoded('<r>' + '<a/>'.repeat(50_001) + '</r>')), /node budget/);
});
