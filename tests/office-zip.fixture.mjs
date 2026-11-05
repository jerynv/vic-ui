import { deflateRawSync } from "node:zlib";
export const encoded = text => new TextEncoder().encode(text);
export function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) { crc ^= byte; for (let at = 0; at < 8; at++) crc = crc & 1 ? 0xedb88320 ^ crc >>> 1 : crc >>> 1; }
  return (crc ^ 0xffffffff) >>> 0;
}
export function officeZip(parts, { compress = false, descriptor = false } = {}) {
  const entries = Array.isArray(parts) ? parts : Object.entries(parts);
  const locals = [], central = [];
  let offset = 0;
  for (const [name, content] of entries) {
    const filename = encoded(name), bytes = typeof content === "string" ? encoded(content) : content;
    const packed = compress ? deflateRawSync(bytes) : bytes, crc = crc32(bytes);
    const flags = 0x800 | (descriptor ? 8 : 0), method = compress ? 8 : 0;
    const local = Buffer.alloc(30 + filename.length + packed.length + (descriptor ? 16 : 0));
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(flags, 6); local.writeUInt16LE(method, 8);
    if (!descriptor) { local.writeUInt32LE(crc, 14); local.writeUInt32LE(packed.length, 18); local.writeUInt32LE(bytes.length, 22); }
    local.writeUInt16LE(filename.length, 26); local.set(filename, 30); local.set(packed, 30 + filename.length);
    if (descriptor) { const at = 30 + filename.length + packed.length; local.writeUInt32LE(0x08074b50, at); local.writeUInt32LE(crc, at + 4); local.writeUInt32LE(packed.length, at + 8); local.writeUInt32LE(bytes.length, at + 12); }
    const header = Buffer.alloc(46 + filename.length);
    header.writeUInt32LE(0x02014b50, 0); header.writeUInt16LE(20, 4); header.writeUInt16LE(20, 6); header.writeUInt16LE(flags, 8); header.writeUInt16LE(method, 10);
    header.writeUInt32LE(crc, 16); header.writeUInt32LE(packed.length, 20); header.writeUInt32LE(bytes.length, 24); header.writeUInt16LE(filename.length, 28); header.writeUInt32LE(offset, 42); header.set(filename, 46);
    locals.push(local); central.push(header); offset += local.length;
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return new Uint8Array(Buffer.concat([...locals, directory, end]));
}
const relationships = entries => `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${entries}</Relationships>`;
export const workbookParts = {
  "[Content_Types].xml": '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>',
  "xl/workbook.xml": '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Summary" sheetId="1" r:id="r1"/><sheet name="Details" sheetId="2" r:id="r2"/></sheets></workbook>',
  "xl/_rels/workbook.xml.rels": relationships('<Relationship Id="r1" Target="worksheets/sheet1.xml"/><Relationship Id="r2" Target="worksheets/sheet2.xml"/>'),
  "xl/sharedStrings.xml": '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><si><t>&lt;script&gt;window.__officeRan=true&lt;/script&gt;</t></si><si><r><t>Shared </t></r><r><t>words</t></r></si></sst>',
  "xl/worksheets/sheet1.xml": '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="inlineStr"><is><t>=SUM(A1:A2)</t></is></c><c r="C1" t="b"><v>1</v></c></row><row r="3"><c r="A3"><f>2+2</f><v>4</v></c><c r="B3"><f>NOW()</f></c><c r="C3" t="s"><v>1</v></c></row></sheetData></worksheet>',
  "xl/worksheets/sheet2.xml": '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Second worksheet</t></is></c></row></sheetData></worksheet>',
};
export const presentationParts = {
  "[Content_Types].xml": '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>',
  "ppt/presentation.xml": '<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><p:sldIdLst><p:sldId id="1" r:id="s1"/><p:sldId id="2" r:id="s2"/></p:sldIdLst></p:presentation>',
  "ppt/_rels/presentation.xml.rels": relationships('<Relationship Id="s1" Target="slides/slide1.xml"/><Relationship Id="s2" Target="slides/slide2.xml"/>'),
  "ppt/slides/slide1.xml": '<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><p:spTree><p:sp><p:nvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr><p:txBody><a:p><a:r><a:t>Quarterly report</a:t></a:r></a:p></p:txBody></p:sp><p:sp><p:txBody><a:p><a:r><a:t>&lt;img src=x onerror=alert(1)&gt;</a:t></a:r></a:p></p:txBody></p:sp><p:graphicFrame><a:tbl><a:tr><a:tc><a:p><a:r><a:t>Stored table text</a:t></a:r></a:p></a:tc></a:tr></a:tbl></p:graphicFrame></p:spTree></p:sld>',
  "ppt/slides/slide2.xml": '<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>',
};
