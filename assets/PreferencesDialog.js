import Dialog from './Dialog.js';
import { findElement } from './misc.js';

export default class PreferencesDialog extends Dialog {
  /**
   * @param {PreferencesDialogProps} props
   */
  constructor (props) {
    super(props);
    this.onPushNotificationClick = this.onPushNotificationClick.bind(this);

    /** @type {PreferencesDialogProps} */
    this.props = props;

    /** @type {PreferencesDialogState} */
    this._state = {
      installingProgress: 'ready',
    };

    const { el } = this.props;

    /** @type {HTMLInputElement} */
    this._elWorkTime = findElement(el, 'workTime');
    this._elWorkTime.addEventListener('input', () => this._dispatchChange());

    /** @type {HTMLInputElement} */
    this._elBreakTime = findElement(el, 'breakTime');
    this._elBreakTime.addEventListener('input', () => this._dispatchChange());

    /** @type {HTMLInputElement} */
    this._elPushNotificationEnabled = findElement(el, 'pushNotificationEnabled');
    this._elPushNotificationEnabled.addEventListener('input', this.onPushNotificationClick);

    /** @type {HTMLInputElement} */
    this._elSound = findElement(el, 'sound');
    this._elSound.addEventListener('input', () => this._dispatchChange());

    /** @type {HTMLElement} */
    this._elVolumeValue = findElement(el, 'volumeValue');

    /** @type {HTMLInputElement} */
    this._elVolume = findElement(el, 'volume');
    this._elVolume.addEventListener('input', () => this._dispatchChange());

    /** @type {HTMLButtonElement} */
    this._elPlaySound = findElement(el, 'playSound');
    this._elPlaySound.addEventListener('click', () => this._playSound());

    /** @type {HTMLButtonElement} */
    this._elResetDefault = findElement(el, 'resetDefault');
    this._elResetDefault.addEventListener('click', () => this._resetDefault());

    /** @type {HTMLElement} */
    this._elAppSection = findElement(el, 'appSection');

    /** @type {HTMLButtonElement} */
    this._elInstall = findElement(el, 'install');
    this._elInstall.addEventListener('click', () => this.onInstallClick());

    /** @type {HTMLElement} */
    this._elInstallationAcceptedMessage = findElement(el, 'installationAcceptedMessage');
    this._elInstallationDismissedMessage = findElement(el, 'installationDismissedMessage');

    this._render();
  }

  /**
   * @param {Partial<PreferencesDialogProps>} props
   */
  updateProps (props) {
    super.updateProps(props);
  }

  onPushNotificationClick () {
    const { permission } = Notification;
    if (permission === 'denied') {
      this._elPushNotificationEnabled.checked = false;

      // eslint-disable-next-line no-alert
      window.alert('You have denied push Notification. You have to update your decision.');
    } else if (permission === 'default') {
      this._elPushNotificationEnabled.checked = false;

      Notification.requestPermission((newPermission) => {
        this._elPushNotificationEnabled.disabled = false;

        if (newPermission === 'granted') {
          this._elPushNotificationEnabled.checked = true;
          this._dispatchChange();
        } else {
          this._elPushNotificationEnabled.checked = false;
        }
      });
    } else {
      // WIP
      const sw = navigator.serviceWorker.controller;
      if (!sw) {
        throw new Error('Service worker must have taken control');
      }
      sw.postMessage({
        delay: 10,
        title: 'Hello World!',
        type: 'notification',
      });

      this._dispatchChange();
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
    const pref = this.props.preferences;

    // timer
    this._elWorkTime.value = String(this._msToMin(pref.workTime));
    this._elBreakTime.value = String(this._msToMin(pref.breakTime));

    // notification
    this._elPushNotificationEnabled.checked = pref.pushNotificationEnabled;
    this._elSound.value = pref.sound;
    const volumeText = String(Math.round(pref.volume * 100));
    this._elVolumeValue.textContent = volumeText;
    this._elVolume.value = volumeText;

    // app
    this._elAppSection.hidden = !this.props.beforeInstallPromptEvent;
    this._elInstall.disabled = this._state.installingProgress !== 'ready';
    this._elInstallationAcceptedMessage.hidden = this._state.installingProgress !== 'accepted';
    this._elInstallationDismissedMessage.hidden = this._state.installingProgress !== 'dismissed';
  }

  /**
   * @param {Partial<PreferencesDialogState>} state
   */
  _setState (state) {
    super._setState(state);
  }

  _playSound () {
    this.props.onPlayChime();
  }

  _resetDefault () {
    // eslint-disable-next-line no-alert
    const ok = window.confirm('Are you sure you want to reset all settings?');
    if (!ok) {
      return;
    }

    this.updateProps({
      preferences: this.props.initialPreferences,
    });
    this._dispatchChange();
  }

  _dispatchChange () {
    this.props.onChange({
      ...this.props.preferences,
      breakTime: this._minToMs(Number(this._elBreakTime.value)),
      pushNotificationEnabled: this._elPushNotificationEnabled.checked,
      sound: this._elSound.value,
      volume: Math.round(Number(this._elVolume.value)) / 100 || 0,
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
