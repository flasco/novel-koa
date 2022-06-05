const SW_VERSION = '0.2.0';
const STATIC_CACHE_NAME = `static-cache-${SW_VERSION}`;
const DATA_CACHE_NAME = `data-cache-${SW_VERSION}`;

// 可以不同源
const FILES_TO_CACHE = ['./'];

self.addEventListener('install', e => {
  console.log(`[sw-${SW_VERSION}]: install`);
  e.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then(async cache => {
        const existKeys = await cache.keys();
        if (existKeys.length > 8) {
          // 如果已缓存的静态资源超过了一定数量，说明已经有很多过期的版本了，可以删掉重新load
          await Promise.all(existKeys.map(k => cache.delete(k)));
        }
        cache.addAll(FILES_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', () => {
  caches.keys().then(keys => {
    return Promise.all(
      keys.map(key => {
        if (![STATIC_CACHE_NAME, DATA_CACHE_NAME].includes(key)) {
          return caches.delete(key);
        }
      })
    );
  });
});

function canCache(status, methods) {
  return status === 200 && methods.toLowerCase() === 'get';
}

async function cleanCacheWithLimitLen(cache, limit = 50) {
  // keys的顺序按照insert的顺序排列，按顺序删即可
  const keys = await cache.keys();
  if (keys.length < limit) return;

  // 删除60%的过期cache
  const deletedKeys = keys.slice(0, keys.length - ((limit * 0.6) | 0));
  const workers = deletedKeys.map(k => cache.delete(k));
  // 确保删除操作完成，避免并发请求时的重复删除
  await Promise.all(workers);
}

self.addEventListener('fetch', e => {
  const requestKey = e.request.url;

  if (requestKey.includes('/api/')) {
    e.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(e.request)
          .then(async res => {
            // 仅缓存 get 请求
            if (canCache(res.status, e.request.method.toLowerCase())) {
              // 控制缓存数量，保证静态资源的缓存可以长时间的保留
              await cleanCacheWithLimitLen(cache, 50);
              cache.put(requestKey, res.clone());
            }
            return res;
          })
          .catch(() => {
            return cache.match(requestKey);
          });
      })
    );
  } else {
    e.respondWith(
      caches.open(STATIC_CACHE_NAME).then(async cache => {
        const payload = await cache.match(requestKey);

        const fetchAndUpdate = () =>
          fetch(e.request)
            .then(res => res.redirected ? fetch(res.url) : res)
            .then(res => {
              if (canCache(res.status, e.request.method.toLowerCase())) {
                cache.put(requestKey, res.clone());
              }
              return res;
            })
            .catch(() => {
              return cache.match(requestKey);
            });
        // 如果已有缓存，就优先返回，会在返回途中做一下更新的操作
        if (payload) {
          fetchAndUpdate();
          return payload;
        }

        // 如果没有的话就做个更新
        return fetchAndUpdate();
      })
    );
  }
});

// 监听push消息
self.addEventListener('push', function (event) {
  const notificationData = event.data.json();
  const title = notificationData.title;
  event.waitUntil(self.registration.showNotification(title, notificationData));
});

// 监听notification事件
self.addEventListener('notificationclick', function (e) {
  const notification = e.notification;
  notification.close();
  e.waitUntil(clients.openWindow(notification.data.url));
});
