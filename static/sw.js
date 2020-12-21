/* eslint-disable no-undef */
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

const CACHE_NAME = 'v1';

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      var fetchRequest = event.request.clone();
      if (
        fetchRequest.cache === 'only-if-cached' &&
        fetchRequest.mode !== 'same-origin'
      ) {
        return;
      }
      return fetch(fetchRequest).then(function (response) {
        if (!response) {
          return response;
        }
        if (
          fetchRequest.url.indexOf('/data/') === -1 &&
          fetchRequest.url.indexOf('lastfm-img2') === -1
        ) {
          return response;
        }
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
