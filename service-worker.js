/* The Dynasty — Service Worker
   Strategi:
   - Precache aset inti (resilient, satu per satu)
   - Cache-first untuk aset statis
   - Network-first untuk data JSON dan halaman HTML
   - Fallback offline minimal
*/

const CACHE_VERSION = 'dynasty-v1';
const RUNTIME_CACHE = 'dynasty-runtime-v1';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './pages/about.html',
  './pages/servers.html',
  './pages/requirements.html',
  './pages/ranks.html',
  './pages/guide.html',
  './pages/gallery.html',
  './pages/news.html',
  './pages/recruitment.html',
  './pages/contact.html',
  './css/reset.css',
  './css/variables.css',
  './css/main.css',
  './css/responsive.css',
  './css/components/navbar.css',
  './css/components/buttons.css',
  './css/components/cards.css',
  './css/components/modal.css',
  './css/components/footer.css',
  './css/pages/home.css',
  './css/pages/about.css',
  './css/pages/servers.css',
  './css/pages/requirements.css',
  './css/pages/ranks.css',
  './css/pages/guide.css',
  './css/pages/gallery.css',
  './css/pages/news.css',
  './css/pages/recruitment.css',
  './css/pages/contact.css',
  './js/app.js',
  './js/navigation.js',
  './js/animation.js',
  './js/pwa.js',
  './js/components/navbar.js',
  './js/components/footer.js',
  './js/components/modal.js',
  './js/pages/home.js',
  './js/pages/servers.js',
  './js/pages/gallery.js',
  './js/pages/news.js',
  './js/pages/recruitment.js',
  './data/dynasty.json',
  './data/servers.json',
  './data/recruitment.json',
  './data/ranks.json',
  './data/news.json',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      // Cache satu per satu supaya satu file yang tidak ada tidak menggagalkan seluruh instalasi.
      return Promise.all(
        PRECACHE_ASSETS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => null)
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

function isDataRequest(url) {
  return url.pathname.endsWith('.json');
}

function isDocumentRequest(request) {
  return request.mode === 'navigate' || request.destination === 'document';
}

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch (error) {
    return;
  }

  // Hanya tangani request same-origin.
  if (url.origin !== self.location.origin) return;

  // Network-first untuk JSON dan dokumen HTML.
  if (isDataRequest(url) || isDocumentRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, copy).catch(() => null);
          });
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => {
            if (cached) return cached;
            if (isDocumentRequest(request)) {
              return caches.match('./index.html');
            }
            return new Response('', { status: 504, statusText: 'Offline' });
          })
        )
    );
    return;
  }

  // Cache-first untuk aset statis.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, copy).catch(() => null);
          });
          return response;
        })
        .catch(() => new Response('', { status: 504, statusText: 'Offline' }));
    })
  );
});