import { deflateSync } from "node:zlib";
import { crc32, officeZip } from "./office-zip.fixture.mjs";
const png = (width = 1, height = 1, padding = 0) => {
  const chunk = (name, bytes) => { const tag = Buffer.from(name), out = Buffer.alloc(12 + bytes.length); out.writeUInt32BE(bytes.length); out.set(tag, 4); out.set(bytes, 8); out.writeUInt32BE(crc32(Buffer.concat([tag, bytes])), 8 + bytes.length); return out; };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(width); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6;
  const pixels = width * height <= 4_000_000 ? Buffer.alloc(height * (1 + width * 4)) : Buffer.from([0,30,90,140,255]);
  pixels.set([0,30,90,140,255]);
  return new Uint8Array(Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk("IHDR", ihdr), ...(padding ? [chunk("tEXt", Buffer.concat([Buffer.from("Padding\0"), Buffer.alloc(padding, 65)]))] : []), chunk("IDAT", deflateSync(pixels)), chunk("IEND", Buffer.alloc(0))]));
};
const rel = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/";
const word = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
export const documentXml = body => `<w:document xmlns:w="${word}" xmlns:r="${rel.slice(0,-1)}" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/></w:sectPr></w:body></w:document>`;
const paragraph = words => `<w:p><w:r><w:t>${words}</w:t></w:r></w:p>`;
const picture = '<w:p><w:r><w:drawing><wp:inline><wp:extent cx="914400" cy="914400"/><wp:docPr id="1" name="Blue pixel"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="1" name="Pixel"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="image"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="914400" cy="914400"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>';
const table = '<w:tbl><w:tblPr><w:tblW w:w="4000" w:type="dxa"/></w:tblPr><w:tblGrid><w:gridCol w:w="2000"/><w:gridCol w:w="2000"/></w:tblGrid><w:tr><w:tc>'+paragraph("Quarter")+'</w:tc><w:tc>'+paragraph("Revenue")+'</w:tc></w:tr><w:tr><w:tc>'+paragraph("Q1")+'</w:tc><w:tc>'+paragraph("120")+'</w:tc></w:tr></w:tbl>';
export const baseDocxParts = {
  "[Content_Types].xml": `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
  "_rels/.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="document" Type="${rel}officeDocument" Target="word/document.xml"/></Relationships>`,
  "word/document.xml": documentXml('<w:p><w:r><w:rPr><w:b/><w:sz w:val="32"/></w:rPr><w:t>Quarterly report</w:t></w:r></w:p>' + table + picture + '<w:p><w:hyperlink r:id="link"><w:r><w:t>External link becomes text</w:t></w:r></w:hyperlink></w:p>' + paragraph('&lt;img src=x onerror=alert(1)&gt;')),
  "word/_rels/document.xml.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="image" Type="${rel}image" Target="media/pixel.png"/><Relationship Id="link" Type="${rel}hyperlink" Target="https://must-not-fetch.invalid/link" TargetMode="External"/></Relationships>`,
  "word/media/pixel.png": png(),
};
const plainParts = { ...baseDocxParts, "word/document.xml": documentXml(paragraph("Current document")) };
delete plainParts["word/media/pixel.png"];
plainParts["word/_rels/document.xml.rels"] = '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>';
const zip = parts => Array.from(officeZip(parts, { compress: true }));
const extraRelation = (type, target) => baseDocxParts["word/_rels/document.xml.rels"].replace('</Relationships>', `<Relationship Id="${type}" Type="${rel}${type}" Target="${target}"/></Relationships>`);
const styles = font => ({ ...baseDocxParts,
  "word/_rels/document.xml.rels": extraRelation("styles", "styles.xml"),
  "word/styles.xml": `<w:styles xmlns:w="${word}"><w:style w:type="paragraph" w:styleId="Normal"><w:rPr><w:rFonts w:ascii="${font}"/></w:rPr></w:style></w:styles>`,
});
const numbering = (levels, instances, levelText = "%1.") => ({ ...plainParts,
  "word/_rels/document.xml.rels": extraRelation("numbering", "numbering.xml"),
  "word/numbering.xml": `<w:numbering xmlns:w="${word}"><w:abstractNum w:abstractNumId="0">${Array.from({ length: levels }, (_, index) => `<w:lvl w:ilvl="${index}"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="${levelText}"/></w:lvl>`).join("")}</w:abstractNum>${Array.from({ length: instances }, (_, index) => `<w:num w:numId="${index}"><w:abstractNumId w:val="0"/></w:num>`).join("")}</w:numbering>`,
});
const header = padding => ({ ...baseDocxParts,
  "word/document.xml": documentXml(Array.from({ length: 5 }, (_, index) => `<w:p><w:r><w:t>Header page ${index + 1}</w:t>${index < 4 ? '<w:br w:type="page"/>' : ''}</w:r></w:p>`).join("")).replace('<w:sectPr>', '<w:sectPr><w:headerReference w:type="default" r:id="header"/>'),
  "word/_rels/document.xml.rels": extraRelation("header", "header1.xml"),
  "word/header1.xml": documentXml(picture).replace('<w:document ', '<w:hdr ').replace('<w:body>', '').replace(/<w:sectPr>[\s\S]*$/, '</w:hdr>'),
  "word/_rels/header1.xml.rels": baseDocxParts["word/_rels/document.xml.rels"],
  "word/media/pixel.png": png(1, 1, padding),
});
export const docxCases = {
  good: zip(baseDocxParts), plain: zip(plainParts), invalid: [0,1,2],
  repeated: zip({ ...baseDocxParts, "word/document.xml": documentXml(paragraph("Two image placements") + picture.repeat(2)) }),
  repeatedBudget: zip({ ...baseDocxParts, "word/document.xml": documentXml(picture.repeat(101)) }),
  repeatedPixels: zip({ ...baseDocxParts, "word/document.xml": documentXml(picture.repeat(3)), "word/media/pixel.png": png(2000,2000) }),
  numbered: zip({ ...baseDocxParts,
    "word/document.xml": documentXml('<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>First numbered item</w:t></w:r></w:p><w:p><w:r><w:t>Non</w:t><w:noBreakHyphen/><w:t>breaking</w:t></w:r></w:p>'),
    "word/_rels/document.xml.rels": extraRelation("numbering", "numbering.xml"),
    "word/numbering.xml": `<w:numbering xmlns:w="${word}"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:suff w:val="tab"/></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`,
  }),
  escapedUrl: zip(styles('u\\72 l(https://must-not-fetch.invalid/style)')),
  escapedImport: zip(styles('@im\\70 ort/**/\\75 rl(https://must-not-fetch.invalid/import)')),
  imageSet: zip(styles('image-set(https://must-not-fetch.invalid/image-set)')),
  mainBin: zip({ ...plainParts, "_rels/.rels": baseDocxParts["_rels/.rels"].replace('word/document.xml', 'word/payload.bin'), "word/payload.bin": documentXml(paragraph("x".repeat(1_000_001))) }),
  namespacedMainBin: zip({ ...plainParts, "_rels/.rels": baseDocxParts["_rels/.rels"].replace('word/document.xml', 'word/payload.bin').replace('<Relationship Id=', '<Relationship xmlns:x="urn:alternate" Id=').replace(' Type=', ' x:Type=').replace(' Target=', ' x:Target='), "word/payload.bin": documentXml(paragraph("x".repeat(1_000_001))) }),
  stylesBin: zip({ ...plainParts, "word/_rels/document.xml.rels": extraRelation("styles", "styles.bin"), "word/styles.bin": `<w:styles xmlns:w="${word}"/>` }),
  headerBin: zip({ ...header(0), "word/_rels/document.xml.rels": extraRelation("header", "header.bin"), "word/header.bin": header(0)["word/header1.xml"] }),
  numberingLevels: zip(numbering(200, 200)),
  numberingProduct: zip(numbering(9, 100)),
  numberingWeight: zip(numbering(1, 100, "x".repeat(4000))),
  headerGood: zip(header(0)), headerBudget: zip(header(1536 * 1024)),
  external: zip({ ...baseDocxParts, "word/_rels/document.xml.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="image" Type="${rel}image" Target="https://must-not-fetch.invalid/image.png" TargetMode="External"/></Relationships>` }),
  vml: zip({ ...plainParts, "word/document.xml": documentXml('<w:p><w:r><w:pict><v:shape xmlns:v="urn:schemas-microsoft-com:vml" style="background:url(https://must-not-fetch.invalid/style)"/></w:pict></w:r></w:p>') }),
  doctype: zip({ ...plainParts, "word/document.xml": '<!DOCTYPE doc [<!ENTITY x "EXPAND">]>' + documentXml(paragraph('&x;')) }),
  pixels: zip({ ...baseDocxParts, "word/media/pixel.png": png(65535,65535) }),
  macro: zip({ ...plainParts, "word/vbaProject.bin": new Uint8Array([1]) }),
  unsafe: zip({ ...plainParts, "word/document.xml": documentXml('<w:p><w:pPr><w:pStyle w:val="__proto__"/></w:pPr></w:p>') }),
  textBudget: zip({ ...plainParts, "word/document.xml": documentXml(paragraph("x".repeat(1_000_001))) }),
  zipBomb: zip({ ...plainParts, "word/large.bin": new Uint8Array(8 * 1024 * 1024 + 1) }),
};
