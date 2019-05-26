import { findElement, addListener } from "./misc.js";

export default class PomodoroForm {
  /**
   * @param {PomodoroFormProps} props
   */
  constructor (props) {
    this.props = props;

    /** @type {Array<() => void>} */
    this.unsubscribers = [];

    /** @type {HTMLInputElement} */
    this._elRestTime = findElement(this.props.el, 'restTime');
    /** @type {HTMLInputElement} */
    this._elWorkTime = findElement(this.props.el, 'workTime');

    this._setUp();
    this._render();
  }

  destroy () {
    this.unsubscribers.forEach((f) => f());
  }

  /**
   * @param {Partial<PomodoroFormProps>} props
   */
  updateProps (props) {
    /** @type {PomodoroFormProps} */
    this.props = {
      ...this.props,
      ...props,
    };

    this._render();
  }

  _setUp () {
    this.unsubscribers.push(addListener(this._elWorkTime, 'input', (event) => {
      const el = event.currentTarget;
      if (!el || !(el instanceof HTMLInputElement)) {
        console.warn(event);
        throw new Error('Cannot retrieve event target');
      }

      const workTime = this._minToMs(Number(el.value));
      this._render();
      this._dispatchChange({ workTime });
    }));

    this.unsubscribers.push(addListener(this._elRestTime, 'input', (event) => {
      const el = event.currentTarget;
      if (!el || !(el instanceof HTMLInputElement)) {
        console.warn(event);
        throw new Error('Cannot retrieve event target');
      }

      const restTime = this._minToMs(Number(el.value));
      this._render();
      this._dispatchChange({ restTime });
    }));
  }

  _render () {
    this._elRestTime.value = String(this._msToMin(this.props.values.restTime));
    this._elWorkTime.value = String(this._msToMin(this.props.values.workTime));
  }

  /**
   * @param {Partial<PomodoroState>} values
   */
  _dispatchChange (values) {
    const newValues = {
      ...this.props.values,
      ...values,
    };
    this.props.onChange(newValues);
  }

  /**
   * @param {number} ms
   */
  _msToMin (ms) {
    return Math.floor(ms / (60 * 1000));
  }

  /**
   * @param {number} min
   */
  _minToMs (min) {
    return min * 60 * 1000;
  }
}
