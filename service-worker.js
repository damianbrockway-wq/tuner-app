const CACHE = 'tuner-v69';
const ASSETS = [
  './',
  './index.html',
  './prize.mp4',
  './chord-coach.html',
  './song-mode.html',
  './lesson.html',
  './lessons.html',
  './practice.html',
  './ear.html',
  './profile.html',
  './song-sheet.html',
  './stats.html',
  './diag.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const isPage = req.mode === 'navigate' ||
    (req.method === 'GET' && (req.headers.get('accept') || '').includes('text/html'));

  if (isPage) {
    // Stale-while-revalidate: serve cached page instantly, refresh in the background.
    e.respondWith(
      caches.match(req).then(cached => {
        const net = fetch(req)
          .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; })
          .catch(() => cached || caches.match('./index.html'));
        return cached || net;
      })
    );
    return;
  }
  // Cache-first for static assets (icons, manifest).
  e.respondWith(caches.match(req).then(h => h || fetch(req)));
});
