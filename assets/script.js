/* eslint-disable no-use-before-define */
import Chime from './Chime.js';
import { findElement, remainTimeToString } from './misc.js';
import PomodoroClock from './PomodoroClock.js';
import PomodoroTimer from './PomodoroTimer.js';
import PreferencesDialog from './PreferencesDialog.js';

/** @type {BeforeInstallPromptEvent | null} */
let beforeInstallPromptEvent = null;

function main () {
  // sometimes I open `http://localhost/` accidentally
  if (!window.location.pathname.startsWith('/pwa-pomodoro/')) {
    window.location.replace('/pwa-pomodoro/');
    return;
  }

  /** @type {PomodoroPreferences} */
  const initialPreferences = Object.freeze({
    breakTime: 5 * 60 * 1000,
    pushNotificationEnabled: false,
    sound: 'chime',
    volume: 1,
    workTime: 25 * 60 * 1000,
  });

  /** @type {HTMLElement} */
  const elRemainingTime = findElement(document.body, 'remainingTime');

  /** @type {Map<string, [() => void, () => void]>} */
  const sceneActions = new Map();
  sceneActions.set('preferences', [() => {
    preferencesDialog.updateProps({
      beforeInstallPromptEvent,
    });
    preferencesDialog.show();
  }, () => {
    preferencesDialog.hide();
  }]);

  const onHistoryChange = () => {
    const search = window.location.search.slice(1);
    const sPairs = search.split('&');
    /** @type {Map<string, string>} */
    const queryMap = sPairs.reduce((map, sPair) => {
      const index = sPair.indexOf('=');
      if (index >= 0) {
        const key = sPair.slice(0, index);
        const value = sPair.slice(index + 1);
        map.set(key, value);
      } else {
        map.set(sPair, '');
      }
      return map;
    }, new Map());

    const scene = queryMap.get('scene') || '';
    sceneActions.forEach(([on, off], key) => {
      if (key === scene) {
        on();
      } else {
        off();
      }
    });
  };

  window.addEventListener('popstate', onHistoryChange);

  const clock = new PomodoroClock({
    active: false,
    el: findElement(document.body, 'clock'),
    preferences: initialPreferences,
    progress: 0,
    onClick: (active) => {
      if (active) {
        timer.stop();
        chime.stop();
      } else {
        timer.start();
      }
    },
    onTurn: (degree) => {
      const progress = degree / 360;
      timer.setProgress(progress);
    },
  });

  const chime = new Chime({
    preferences: initialPreferences,
  });

  const timer = new PomodoroTimer({
    onStatusChange: (status, old) => {
      // WIP
      console.log('# status', `${old} -> ${status}`);

      // WIP
      if (status !== 'stop' && old !== 'stop') {
        chime.play();
      }

      clock.updateProps({
        active: status !== 'stop',
      });

      setRemainingTime(0);
    },
    onUpdate: (progress, remaining) => {
      clock.updateProps({ progress });

      setRemainingTime(remaining);
    },
    preferences: initialPreferences,
  });

  const preferencesDialog = new PreferencesDialog({
    beforeInstallPromptEvent,
    el: findElement(document.body, 'preferencesDialog'),
    initialPreferences,
    onChange: (state) => {
      updatePreferences(state);
    },
    onDone: () => {
      window.history.back();
    },
    onInstall: (installed) => {
      if (installed) {
        beforeInstallPromptEvent = null;
      }
    },
    onPlayChime: () => {
      chime.toggle();
    },
    preferences: initialPreferences,
  });

  /** @type {HTMLButtonElement} */
  const elOpenPreference = findElement(document.body, 'openPreferences');
  elOpenPreference.addEventListener('click', () => {
    window.history.pushState({}, '', '?scene=preferences');
    onHistoryChange();
  });

  /**
   * @param {PomodoroPreferences} preferences
   */
  const updatePreferences = (preferences) => {
    chime.updateProps({ preferences });
    clock.updateProps({ preferences });
    timer.updateProps({
      preferences,
    });
    preferencesDialog.updateProps({ preferences });
  };

  /**
   * @param {number} remainingTime
   */
  function setRemainingTime (remainingTime) {
    const dot = (remainingTime % 1000) > 500 ? '.' : '\u00a0';
    const text = `\u00a0${remainTimeToString(remainingTime)}${dot}`;
    if (elRemainingTime.textContent !== text) {
      elRemainingTime.textContent = text;
    }
  }

  onHistoryChange();
}

document.addEventListener('DOMContentLoaded', main);

window.addEventListener('beforeinstallprompt',
/**
 * (BeforeInstallPromptEvent is not compatible with Event.
 *  Use force-casting here until type definition is ready.)
 * @param {any} event
 */
  (event) => {
    beforeInstallPromptEvent = event;
  });

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/pwa-pomodoro/service-worker.js');
      // eslint-disable-next-line no-console
      console.log('[ServiceWorker] Register');
    } catch (error) {
      console.error(error);
    }
  });
}
