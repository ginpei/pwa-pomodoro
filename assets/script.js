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
        cycle: values.workTime + values.workTime,
      });
      form.updateProps({ values });
    },
    values: initialValues,
  });

  const timer = new PomodoroTimer({
    cycle: initialValues.workTime + initialValues.workTime,
    onUpdate: (progress) => hand.updateProps({
      degree: progress * 360,
    }),
  });
  timer.start();
}

document.addEventListener('DOMContentLoaded', main);
