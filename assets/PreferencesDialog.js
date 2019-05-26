import { findElement } from './misc.js';

export default class PreferencesDialog {
  /**
   * @param {PreferencesDialogProps} props
   */
  constructor (props) {
    /** @type {PreferencesDialogProps} */
    this.props = props;

    const { el } = this.props;

    /** @type {HTMLButtonElement} */
    this._elDone = findElement(el, 'done');
    this._elDone.addEventListener('click', () => this.props.onDone());

    /** @type {HTMLInputElement} */
    this._elWorkTime = findElement(el, 'workTime');
    this._elWorkTime.addEventListener('input', () => this.props.onChange({
      ...this.props.pomodoroState,
      workTime: this._minToMs(Number(this._elWorkTime.value)),
    }));

    /** @type {HTMLInputElement} */
    this._elRestTime = findElement(el, 'restTime');
    this._elRestTime.addEventListener('input', () => this.props.onChange({
      ...this.props.pomodoroState,
      restTime: this._minToMs(Number(this._elRestTime.value)),
    }));

    this._render();
  }

  /**
   * @param {Partial<PreferencesDialogProps>} props
   */
  updateProps (props) {
    this.props = {
      ...this.props,
      ...props,
    };

    this._render();
  }

  destroy () {
  }

  show () {
    this.props.el.hidden = false;
  }

  hide () {
    this.props.el.hidden = true;
  }

  _render () {
    const state = this.props.pomodoroState;

    this._elWorkTime.value = String(this._msToMin(state.workTime));
    this._elRestTime.value = String(this._msToMin(state.restTime));
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
