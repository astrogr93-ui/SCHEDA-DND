// D&D 5e PWA — Service Worker
// Versione cache: aggiorna questo numero quando rilasci nuove versioni
const CACHE_NAME = 'dnd5e-v7';

const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/data.js',
  '/js/app.js',
  '/js/armor.js',
  '/js/rest.js',
  '/js/save.js',
  '/js/builder.js',
  '/manifest.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
];

// Installa e pre-cacha tutto
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Carica font separatamente (può fallire su alcuni browser)
        const coreAssets = ASSETS.filter(a => !a.startsWith('https://fonts'));
        const fontAssets = ASSETS.filter(a => a.startsWith('https://fonts'));
        return cache.addAll(coreAssets)
          .then(() => Promise.allSettled(fontAssets.map(f => cache.add(f))));
      })
      .then(() => self.skipWaiting())
  );
});

// Attiva e pulisce vecchie cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Strategia: Cache First, poi network fallback
self.addEventListener('fetch', e => {
  // Skip cross-origin requests non-font
  if (!e.request.url.startsWith(self.location.origin) &&
      !e.request.url.startsWith('https://fonts.g')) {
    return;
  }
  e.respondWith(
    caches.match(e.request)
      .then(cached => {
        if (cached) return cached;
        return fetch(e.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            const toCache = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, toCache));
            return response;
          })
          .catch(() => {
            // Offline fallback per pagine HTML
            if (e.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Ricevi messaggi dall'app (es. force refresh)
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
