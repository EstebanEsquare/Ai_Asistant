const CACHE_NAME = 'pamuk-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png'
];

// Yükleme ve Önbelleğe Alma
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Yeni sürümü hemen aktifleştir
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Pamuk: Önbellek güncelleniyor...');
      return cache.addAll(ASSETS);
    })
  );
});

// Eski Önbellekleri Temizleme
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Strateji: Önbellek yoksa ağdan çek
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
