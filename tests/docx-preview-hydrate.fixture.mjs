import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { DocxFixture } from "./docx-preview.fixture.mjs";
const bitmap = window.createImageBitmap.bind(window), Observer = window.ResizeObserver;
window.docxBitmaps = []; window.docxUrls = []; window.docxObservers = new Set();
window.docxInertRenders = 0; window.docxFileReads = 0; window.docxFileReadBytes = 0;
const inert = DOMImplementation.prototype.createHTMLDocument;
DOMImplementation.prototype.createHTMLDocument = function (...args) { window.docxInertRenders++; return inert.apply(this, args); };
const create = URL.createObjectURL.bind(URL);
URL.createObjectURL = value => { const url = create(value); window.docxUrls.push(url); return url; };
window.createImageBitmap = async (...args) => {
  const image = await bitmap(...args), close = image.close.bind(image);
  const record = { closed: false }; window.docxBitmaps.push(record);
  image.close = () => { record.closed = true; close(); };
  if (window.deferDocxBitmap) { window.deferDocxBitmap = false; return new Promise(resolve => { window.resolveDocxBitmap = () => resolve(image); }); }
  return image;
};
const readImage = FileReader.prototype.readAsDataURL;
FileReader.prototype.readAsDataURL = function (blob) {
  window.docxFileReads++; window.docxFileReadBytes += blob.size;
  if (window.deferDocxFileReader) {
    window.deferDocxFileReader = false;
    window.resolveDocxFileReader = () => readImage.call(this, blob);
    return;
  }
  return readImage.call(this, blob);
};
window.ResizeObserver = class extends Observer {
  observe(node, ...args) { if (node.classList.contains("ui-preview-docx")) window.docxObservers.add(this); return super.observe(node, ...args); }
  disconnect() { window.docxObservers.delete(this); return super.disconnect(); }
};
hydrateRoot(document.getElementById("root"), createElement(DocxFixture, { cases: window.docxCases }));
