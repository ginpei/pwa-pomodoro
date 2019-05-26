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
    this._elWorkTime.addEventListener('input', () => this._dispatchChange());

    /** @type {HTMLInputElement} */
    this._elBreakTime = findElement(el, 'breakTime');
    this._elBreakTime.addEventListener('input', () => this._dispatchChange());

    /** @type {HTMLButtonElement} */
    this._elResetDefault = findElement(el, 'resetDefault');
    this._elResetDefault.addEventListener('click', () => this._resetDefault());

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
    this._elBreakTime.value = String(this._msToMin(state.breakTime));
  }

  _resetDefault () {
    const ok = window.confirm('Are you sure you want to reset all settings?');
    if (!ok) {
      return;
    }

    this.updateProps({
      pomodoroState: this.props.initialPomodoroState,
    });
    this._dispatchChange();
  }

  _dispatchChange () {
    this.props.onChange({
      ...this.props.pomodoroState,
      breakTime: this._minToMs(Number(this._elBreakTime.value)),
      workTime: this._minToMs(Number(this._elWorkTime.value)),
    });
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
