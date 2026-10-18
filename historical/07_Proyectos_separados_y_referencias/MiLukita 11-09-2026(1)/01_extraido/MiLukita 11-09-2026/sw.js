const CACHE_NAME = "multi-juegos-piloto-v3";
const OFFLINE_ASSET_CACHE = "milukita-offline-assets-v1";
const APP_SHELL = [
  "/",
  "/generador-qr",
  "/qr-circular-lukita",
  "/mapper",
  "/the-eye",
  "/mapper-the-eye",
  "/offline.html",
  "/manifest.webmanifest",
  "/pwa-icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        await Promise.allSettled(APP_SHELL.map(async (path) => {
          try {
            const response = await fetch(path, { credentials: "include" });
            if (response.ok) await cache.put(path, response);
          } catch {
            // Una ruta protegida no debe impedir la instalación del worker.
          }
        }));
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => ![CACHE_NAME, OFFLINE_ASSET_CACHE].includes(key)).map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_EVIDENCE_ASSETS" || !Array.isArray(event.data.urls)) return;
  const urls = event.data.urls.filter((url) => typeof url === "string").slice(0, 24);
  event.waitUntil(
    caches.open(OFFLINE_ASSET_CACHE).then(async (cache) => {
      for (const url of urls) {
        try {
          const response = await fetch(url, { mode: "no-cors", credentials: "omit" });
          if (response.ok || response.type === "opaque") await cache.put(url, response);
        } catch {
          // La galería conserva los metadatos locales aunque un asset remoto no pueda cachearse.
        }
      }
    }),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/@") || url.pathname.startsWith("/src/") || url.pathname.includes("/node_modules/")) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => Promise.all([
          cache.put(event.request, copy),
        ])).catch(() => undefined);
        return response;
      }).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(event.request)) || (await cache.match(url.pathname)) || (await cache.match("/")) || (await cache.match("/offline.html"));
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (url.origin === self.location.origin || response.type === "opaque") {
        const copy = response.clone();
        const cacheName = url.origin === self.location.origin ? CACHE_NAME : OFFLINE_ASSET_CACHE;
        caches.open(cacheName).then((cache) => cache.put(event.request, copy)).catch(() => undefined);
      }
      return response;
    })),
  );
});
