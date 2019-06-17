/* eslint-disable no-use-before-define */
/// <reference path="./node_modules/typescript/lib/lib.es2015.d.ts" />
/// <reference path="./node_modules/typescript/lib/lib.webworker.d.ts" />
/// <reference path="./types/common.d.ts" />
/// <reference path="./types/controller.d.ts" />
/// <reference path="./assets/sw/PomodoroTimer.js" />

/** @type {ServiceWorkerGlobalScope} */
// @ts-ignore
// eslint-disable-next-line no-restricted-globals
const sw = self;

sw.importScripts('./assets/sw/PomodoroTimer.js');

/** @type {Readonly<PomodoroPreferences>} */
const initialPreferences = Object.freeze({
  breakTime: 5 * 60 * 1000,
  pushNotificationEnabled: false,
  sound: 'chime',
  volume: 1,
  workTime: 25 * 60 * 1000,
});

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

sw.onmessage = async (event) => {
  /** @type {{ data: ClientMessage }} */
  const { data } = event;
  switch (data.type) {
    case 'setPreferences': {
      timer.updateProps({ preferences: data.preferences });
      break;
    }

    case 'startTimer': {
      timer.start();
      break;
    }

    case 'stopTimer': {
      timer.stop();
      break;
    }

    case 'setProgress': {
      timer.setProgress(data.progress);
      break;
    }

    case 'setAdjusting': {
      const { adjusting } = data;
      console.log('# adjusting', adjusting);
      break;
    }

    default:
      // nothing to do
  }
};

/**
 * @param {ControllerMessage} message
 */
async function postMessageToClient (message) {
  const clients = await sw.clients.matchAll();
  if (clients.length < 1) {
    throw new Error('No clients found');
  }

  clients.forEach((client) => {
    client.postMessage(message);
  });
}

const timer = new globalThis.PomodoroTimer({
  onStatusChange: (status, oldStatus) => {
    postMessageToClient({
      oldStatus,
      status,
      type: 'statusChange',
    });
  },
  onUpdate: (progress, remaining) => {
    postMessageToClient({
      progress,
      remaining,
      type: 'tick',
    });
  },
  preferences: initialPreferences,
});
