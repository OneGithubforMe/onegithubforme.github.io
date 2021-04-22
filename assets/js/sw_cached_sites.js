console.log("in sw_caches_sites")
const cacheName = 'v2'
// Call install event
self.addEventListener('install', (e)=> {
    console.log('Service worker installed')
    
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
    e.respondWith(
        fetch(e.request)
            .then(res => {
                // make a copy/clone of response 
                const resClone = res.clone();
                //open cache
                caches
                    .open(cacheName)
                    .then(cache => {
                        // add response to cache
                        cache.put(e.request, resClone);   
                    })
                return res;
            }).catch(err => caches.match(e.request).then(res => res))
    );
})