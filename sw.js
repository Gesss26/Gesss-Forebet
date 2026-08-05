const CACHE_NAME = 'forebet-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    // Non cachare il file XLSX da GitHub (sempre fresco)
    if (e.request.url.includes('raw.githubusercontent.com')) {
        e.respondWith(fetch(e.request));
        return;
    }
    e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});