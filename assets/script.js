import { findElement, remainTimeToString } from './misc.js';
import PomodoroCircle from './PomodoroCircle.js';
import PomodoroClockHand from './PomodoroClockHand.js';
import PomodoroTimer from './PomodoroTimer.js';
import PomodoroToggleButton from './PomodoroToggleButton.js';
import PreferencesDialog from './PreferencesDialog.js';

/** @type {BeforeInstallPromptEvent | null} */
let beforeInstallPromptEvent = null;

/** @type {HTMLElement} */
const elRemainingTime = findElement(document.body, 'remainingTime');

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

function main () {
  /** @type {PomodoroState} */
  const initialPomodoroState = {
    breakTime: 5 * 60 * 1000,
    pushNotificationEnabled: false,
    sound: 'chime',
    volume: 1,
    workTime: 25 * 60 * 1000,
  };

  /** @type {HTMLCanvasElement} */
  const elCanvas = findElement(document.body, 'circle');

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

  /**
   * @param  {PopStateEvent} [event]
   */
  const onHistoryChange = (event) => {
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

  const circle = new PomodoroCircle({
    el: elCanvas,
    pomodoroState: initialPomodoroState,
  });

  const hand = new PomodoroClockHand({
    active: false,
    el: findElement(document.body, 'clockHand'),
    degree: 0,
  });

  const toggleButton = new PomodoroToggleButton({
    active: false,
    el: findElement(document.body, 'toggle'),
    onClick: (active) => {
      if (active) {
        timer.stop();
      } else {
        timer.start();
      }
    },
  })

  /**
   * @param {PomodoroState} pomodoroState
   */
  const updatePomodoroState = (pomodoroState) => {
    circle.updateProps({ pomodoroState });
    timer.updateProps({
      pomodoroState,
    });
    preferencesDialog.updateProps({ pomodoroState });
  };

  const timer = new PomodoroTimer({
    onStatusChange: (status, old) => {
      console.log('# status', `${old} -> ${status}`);
      hand.updateProps({
        active: status !== 'stop',
        degree: 0,
      });
      toggleButton.updateProps({
        active: status !== 'stop',
      });

      setRemainingTime(0);
    },
    onUpdate: (progress, remaining) => {
      hand.updateProps({
        degree: progress * 360,
      });

      setRemainingTime(remaining);
    },
    pomodoroState: initialPomodoroState,
  });

  const preferencesDialog = new PreferencesDialog({
    beforeInstallPromptEvent,
    el: findElement(document.body, 'preferencesDialog'),
    initialPomodoroState,
    onChange: (state) => {
      updatePomodoroState(state);
    },
    onDone: () => {
      window.history.back();
    },
    onInstall: (installed) => {
      if (installed) {
        beforeInstallPromptEvent = null;
      }
    },
    pomodoroState: initialPomodoroState,
  });

  /** @type {HTMLButtonElement} */
  const elOpenPreference = findElement(document.body, 'openPreferences');
  elOpenPreference.addEventListener('click', () => {
    window.history.pushState({}, '', '?scene=preferences');
    onHistoryChange();
  });

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
      await navigator.serviceWorker.register('/pwa-pomodoro/service-worker.js')
      console.log('[ServiceWorker] Register');
    } catch (error) {
      console.error(error);
    }
  });
}
