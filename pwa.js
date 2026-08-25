(() => {
  "use strict";
  const VERSION = "2026.08.25.02";
  const versionEl = document.getElementById("app-version");
  if (versionEl) versionEl.textContent = VERSION;

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(`/sw.js?v=${VERSION}`).catch(err => {
        console.warn("PWA registration failed", err);
      });
    });
  }
})();
