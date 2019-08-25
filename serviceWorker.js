self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
});

self.addEventListener('fetch', function(event) {
    console.log("[Service Worker] fetched");
});