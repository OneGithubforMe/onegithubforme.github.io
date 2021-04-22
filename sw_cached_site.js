const cacheName = 'v2';

// Call Install Event
self.addEventListener('install', e => {
  console.log('Service Worker: Installed');
});

// Call Activate Event
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Make copy/clone of response
        const resClone = res.clone();
        // Open cahce
        caches.open(cacheName).then(cache => {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});


// var btnAdd = document.getElementById("install_btn")
let deferredPrompt;
self.addEventListener('beforeinstallprompt', e=> {
    //Prvent chrome and earlier from automatically showing the prompt
    e.preventDefault()
    //Stash the event so it can be triggered later.
    deferredPrompt = e;
    //updae UI notify the user they can add to home screen
    // btnAdd.style.display='block'
// });


// btnAdd.addEventListener('click', e => {
    deferredPrompt.Prompt();
    deferredPrompt.userChoice.then(choiceResult => {
        if(choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        }
        deferredPrompt = null;
    });
});


self.addEventListener('appinstalled', evt => {
    app.logEvent('a2hs', 'installed');
})

