// Minimal service worker for PWA installability
// No caching, no fetch interception

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
