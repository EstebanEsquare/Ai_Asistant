const CACHE_NAME = 'ai-assistant-v16';
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'sw.js',
  'icon-512.png'
];

// Service Worker Yükleme (Install) - Varlıkları Önbelleğe Al
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Yeni versiyonun hemen aktif olmasını sağlar
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Önbellek oluşturuluyor: ' + CACHE_NAME);
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Service Worker Aktivasyon (Activate) - Eski Önbellekleri Temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eski önbellek siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch İsteklerini Yönet - Önce Önbellek, Yoksa Ağ (Offline Destek)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Eğer önbellekte varsa onu döndür, yoksa ağdan getir
      return response || fetch(event.request);
    })
  );
});
