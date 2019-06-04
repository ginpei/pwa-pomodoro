/// <reference path="./node_modules/typescript/lib/lib.es2015.d.ts" />
/// <reference path="./node_modules/typescript/lib/lib.webworker.d.ts" />

/** @type {ServiceWorkerGlobalScope} */
// @ts-ignore
// eslint-disable-next-line no-restricted-globals
const sw = self;

const base = '/pwa-pomodoro/';

const cachePaths = [
  'offline.html',
].map((v) => `${base}${v}`);

function getCache () {
  return caches.open('pwa-pomodoro');
}

sw.addEventListener('install', () => {
  // eslint-disable-next-line no-console
  console.log('[ServiceWorker] Install');

  sw.skipWaiting();
});

sw.addEventListener('activate', (event) => {
  // eslint-disable-next-line no-console
  console.log('[ServiceWorker] Activate');

  const p = getCache()
    .then((cache) => cache.addAll(cachePaths));
  event.waitUntil(p);
});

sw.addEventListener('fetch', (event) => {
  const { pathname } = new URL(event.request.url);
  if (!pathname.startsWith(base)) {
    return;
  }

  event.respondWith(fetch(event.request).catch(async () => {
    const cache = await getCache();
    const res = await cache.match(`${base}offline.html`);
    if (res) {
      return res;
    }

    return new Response('Not found');
  }));
});
