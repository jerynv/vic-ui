import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { landscape, PreviewImageFixture } from "./preview-image.fixture.mjs";

const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL);
window.imageUrls = [];
window.imageRevoked = [];
window.callerUrl = create(new Blob([landscape], { type: "image/svg+xml" }));
URL.createObjectURL = blob => {
  const url = create(window.nextImageBlob ?? blob);
  window.nextImageBlob = null;
  window.imageUrls.push(url);
  return url;
};
URL.revokeObjectURL = url => { window.imageRevoked.push(url); revoke(url); };
window.repairImage = () => { window.nextImageBlob = new Blob([landscape], { type: "image/svg+xml" }); };
hydrateRoot(document.getElementById("root"), createElement(PreviewImageFixture));
