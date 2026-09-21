const CACHE_NAME = "arki-static-v3-offline-sync";
const APP_SHELL = ["/", "/arki", "/manifest.webmanifest", "/offline.html", "/arki-icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function isAppRequest(url) {
  return url.origin === self.location.origin && !url.pathname.startsWith("/api/") && !url.pathname.startsWith("/trpc/") && !url.pathname.startsWith("/oauth/");
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (!isAppRequest(url)) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(request).then((cached) => cached || caches.match("/") || caches.match("/offline.html"))));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (!response || response.status !== 200 || response.type === "opaque") return response;
      const copy = response.clone();
      void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      return response;
    })),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") void self.skipWaiting();
});

self.addEventListener("sync", (event) => {
  if (event.tag !== "arki-offline-sync") return;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) client.postMessage({ type: "ARKI_SYNC_REQUEST" });
    }),
  );
});
