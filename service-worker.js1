// Service Worker สำหรับ PWA Energy Monitor
const CACHE_NAME = "energy-monitor-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// ติดตั้ง Service Worker และแคชไฟล์
self.addEventListener("install", event => {
  console.log("[SW] Installing Service Worker...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("[SW] Caching app shell");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// เปิดใช้งาน Service Worker
self.addEventListener("activate", event => {
  console.log("[SW] Activating Service Worker...");
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// จัดการ Fetch requests
self.addEventListener("fetch", event => {
  // ข้าม requests ที่ไม่ใช่ http/https
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ถ้ามีใน cache ให้ใช้จาก cache
        if (response) {
          return response;
        }
        
        // ถ้าไม่มีใน cache ให้ fetch จากเครือข่าย
        return fetch(event.request).then(response => {
          // ตรวจสอบว่า response ถูกต้อง
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response เพื่อเก็บไว้ใน cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // ถ้า offline และไม่มีใน cache ให้แสดงหน้า offline (optional)
        console.log("[SW] Fetch failed; returning offline page");
      })
  );
});
