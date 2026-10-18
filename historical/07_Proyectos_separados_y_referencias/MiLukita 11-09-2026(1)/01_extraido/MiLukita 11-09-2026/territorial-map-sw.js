const TILE_CACHE = "milukita-map-tiles-v1";

self.addEventListener("fetch", event => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.hostname !== "tile.openstreetmap.org") return;

  event.respondWith((async () => {
    const cache = await caches.open(TILE_CACHE);
    const cached = await cache.match(event.request);
    if (cached) return cached;

    try {
      const response = await fetch(event.request);
      if (response.ok || response.type === "opaque") {
        await cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      return cached || Response.error();
    }
  })());
});
