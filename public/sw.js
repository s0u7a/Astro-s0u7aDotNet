self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });
  self.addEventListener('install', (event) => {
      console.log('インストール');
     event.waitUntil(self.skipWaiting());
  });
  self.addEventListener("fetch", (e) => {
    console.log("[Service Worker] Fetched resource " + e.request.url);
  });