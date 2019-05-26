import { findElement } from './misc.js';

export default class PreferencesDialog {
  /**
   * @param {PreferencesDialogProps} props
   */
  constructor (props) {
    /** @type {PreferencesDialogProps} */
    this.props = props;

    /** @type {PreferencesDialogState} */
    this._state = {
      installingProgress: 'ready',
    };

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

    /** @type {HTMLElement} */
    this._elAppSection = findElement(el, 'appSection');

    /** @type {HTMLButtonElement} */
    this._elInstall = findElement(el, 'install');
    this._elInstall.addEventListener('click', () => this.onInstallClick());

    /** @type {HTMLElement} */
    this._elInstallationAcceptedMessage =
      findElement(el, 'installationAcceptedMessage');
    this._elInstallationDismissedMessage =
      findElement(el, 'installationDismissedMessage');

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
    if (this.props.el.animate) {
      this.props.el.animate([
        { opacity: 0, transform: 'scale(1.1)' },
        { opacity: 1, transform: 'scale(1)' },
      ], {
        duration: 200,
      });
    }
  }

  hide () {
    const onfinish = () => this.props.el.hidden = true;
    if (this.props.el.animate) {
      const animation = this.props.el.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.1)' },
      ], {
        duration: 200,
      });
      animation.onfinish = onfinish;
    } else {
      onfinish();
    }
  }

  async onInstallClick () {
    const e = this.props.beforeInstallPromptEvent;
    if (!e) {
      throw new Error('Installation is not ready');
    }

    e.prompt();
    const choice = await e.userChoice;
    const accepted = choice.outcome === 'accepted';
    this._setState({
      installingProgress: accepted ? 'accepted' : 'dismissed',
    });
    this.props.onInstall(accepted);
  }

  _render () {
    const state = this.props.pomodoroState;

    this._elWorkTime.value = String(this._msToMin(state.workTime));
    this._elBreakTime.value = String(this._msToMin(state.breakTime));

    this._elAppSection.hidden = !Boolean(this.props.beforeInstallPromptEvent);

    this._elInstall.disabled = this._state.installingProgress !== 'ready';
    this._elInstallationAcceptedMessage.hidden =
      this._state.installingProgress !== 'accepted';
    this._elInstallationDismissedMessage.hidden =
      this._state.installingProgress !== 'dismissed';
  }

  /**
   * @param {Partial<PreferencesDialogState>} state
   */
  _setState(state) {
    this._state = {
      ...this._state,
      ...state,
    };

    this._render();
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
