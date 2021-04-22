const cacheName = 'v1'
const cacheAssets = [
    'about.html',
    'index.html',
    'main.js',
    'pose_solution_packed_assets.data',
]

// Call install event
self.addEventListener('install', (e)=> {
    console.log('Service worker installed')
    
    e.waitUntil(
        caches
        .open(cacheName)
        .then(cache => {
            console.log("Service Worker: cache files");
            cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    console.log("service worker activated")

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache != cacheName) {
                        console.log("Service Worker: deleting old cache")
                        return caches.delete(cache)
                    }
                })
            )
        }
    )
)
})



self.addEventListener('fetch', e => {
    console.log("service worker: fetching");
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
})