import { findElement } from './misc.js';

export default class Dialog {
  /**
   * @param {DialogProps} props
   */
  constructor (props) {
    /** @type {DialogProps} */
    this.props = props;

    /** @type {{}} */
    this._state = {};

    const { el } = this.props;

    /** @type {HTMLButtonElement} */
    this._elDone = findElement(el, 'done');
    this._elDone.addEventListener('click', () => this.props.onDone());
  }

  /**
   * @param {Partial<DialogProps>} props
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
        duration: 100,
      });
    }
  }

  hide () {
    const onfinish = () => {
      this.props.el.hidden = true;
    };
    if (this.props.el.animate) {
      const animation = this.props.el.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.1)' },
      ], {
        duration: 100,
      });
      animation.onfinish = onfinish;
    } else {
      onfinish();
    }
  }

  /**
   * @param {Partial<PreferencesDialogState>} state
   */
  _setState (state) {
    this._state = {
      ...this._state,
      ...state,
    };

    this._render();
  }

  _render () {
  }
}
