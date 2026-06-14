const CACHE = 'deutsch-vr-v3';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        '/deutsch-app/',
        '/deutsch-app/index.html',
        '/deutsch-app/vocabulary.js',
        '/deutsch-app/manifest.json',
        '/deutsch-app/sw.js'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        return caches.open(CACHE).then(cache => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    }).catch(() => caches.match('/deutsch-app/index.html'))
  );
});
