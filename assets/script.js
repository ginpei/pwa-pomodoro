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
  const elStart = findElement(document.body, 'start');
  elStart.addEventListener('click', () => {
    timer.start();
  });

  /** @type {HTMLButtonElement} */
  const elStop = findElement(document.body, 'stop');
  elStop.addEventListener('click', () => {
    timer.stop();
  });
}

document.addEventListener('DOMContentLoaded', main);
