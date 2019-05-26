import { findElement } from './misc.js';
import PomodoroCircle from './PomodoroCircle.js';
import PomodoroClockHand from './PomodoroClockHand.js';
import PomodoroForm from './PomodoroForm.js';
import PomodoroTimer from './PomodoroTimer.js';

function main () {
  /** @type {PomodoroState} */
  const initialValues = {
    restTime: 5 * 60 * 1000,
    workTime: 25 * 60 * 1000,
  };

  /** @type {HTMLCanvasElement} */
  const elCanvas = findElement(document.body, 'circle');

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
    const els = document.querySelectorAll('[data-scene]');
    els.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.hidden = el.dataset['scene'] !== scene;
      }
    });
  };

  window.addEventListener('popstate', onHistoryChange);

  const circle = new PomodoroCircle({
    el: elCanvas,
    values: initialValues,
  });

  const hand = new PomodoroClockHand({
    el: findElement(document.body, 'clockHand'),
    degree: 0,
  });

  const form = new PomodoroForm({
    el: findElement(document.body, 'pomodoroForm'),
    onChange: (values) => {
      circle.updateProps({ values });
      timer.updateProps({
        pomodoroStatus: values,
      });
      form.updateProps({ values });
    },
    values: initialValues,
  });

  const timer = new PomodoroTimer({
    onStatusChange: (status, old) => {
      console.log('# status', `${old} -> ${status}`);
      hand.updateProps({
        degree: 0,
      })
    },
    onUpdate: (progress) => hand.updateProps({
      degree: progress * 360,
    }),
    pomodoroStatus: initialValues,
  });

  /** @type {HTMLButtonElement} */
  const elOpenPreference = findElement(document.body, 'openPreferences');
  elOpenPreference.addEventListener('click', () => {
    window.history.pushState({}, '', '?scene=preferences');
    onHistoryChange();
  });

  /** @type {HTMLButtonElement} */
  const elStart = findElement(document.body, 'start');
  elStart.addEventListener('click', () => {
    timer.start();
  });

  /** @type {HTMLButtonElement} */
  const elStop = findElement(document.body, 'stop');
  elStop.addEventListener('click', () => {
    timer.stop();
  });

  onHistoryChange();
}

document.addEventListener('DOMContentLoaded', main);
