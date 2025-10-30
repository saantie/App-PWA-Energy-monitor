// Service Worker สำหรับ PWA Energy Monitor
const CACHE_NAME = "energy-monitor-v2";
const urlsToCache = [
  "./",
  "./index.html",
  "./offline.html",
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

  // ข้าม requests ไปยัง Google Apps Script (ต้องการอินเทอร์เน็ต)
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // ถ้าไม่มีอินเทอร์เน็ต แสดงหน้า offline
        return caches.match('./offline.html');
      })
    );
    return;
  }

  // สำหรับ navigation requests (เมื่อเปิดหน้าใหม่)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // ถ้าไม่มีอินเทอร์เน็ต ลองหาใน cache
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // ถ้าไม่มีใน cache แสดงหน้า offline
            return caches.match('./offline.html');
          });
        })
    );
    return;
  }

  // สำหรับ requests อื่นๆ ใช้ Cache-First Strategy
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
        // ถ้า offline และไม่มีใน cache
        console.log("[SW] Fetch failed; returning offline page");
        
        // ถ้าเป็น navigation request แสดงหน้า offline
        if (event.request.mode === 'navigate') {
          return caches.match('./offline.html');
        }
      })
  );
});
