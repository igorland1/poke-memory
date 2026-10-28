// Service Worker para Pixel Memory PWA: Cache de App Shell e Sprites Pokémon
const CACHE_NAME = 'pixel-memory-v1';
const SPRITE_CACHE_NAME = 'pixel-memory-sprites-v1';

// Recursos locais vitais
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

// Instalação: Cacheia App Shell imediatamente
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Ativação: Limpa caches legados
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== SPRITE_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia de Fetch:
// 1. Sprites da PokeAPI (raw.githubusercontent.com) -> Cache First com fallback de rede
// 2. Google Fonts -> Cache First
// 3. Assets locais e navegação -> Stale-While-Revalidate / Network First
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Sprites externos (PokeAPI no GitHub)
  if (url.hostname === 'raw.githubusercontent.com' && url.pathname.includes('/sprites/')) {
    event.respondWith(
      caches.open(SPRITE_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          // Se falhou offline e não estava no cache, retorna resposta vazia
          return new Response('', { status: 408 });
        }
      })
    );
    return;
  }

  // Google Fonts (CSS e WOFF2)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;

        try {
          const res = await fetch(event.request);
          if (res && res.status === 200) {
            cache.put(event.request, res.clone());
          }
          return res;
        } catch {
          return cached || new Response('', { status: 408 });
        }
      })
    );
    return;
  }

  // Requisições normais do app (Stale-While-Revalidate)
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const resClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, resClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Em caso de falha de rede (offline), serve o cache existente ou index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return cachedResponse;
          });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
