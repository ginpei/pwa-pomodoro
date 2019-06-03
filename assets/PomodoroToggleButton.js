import { findElement } from './misc.js';

export default class PomodoroToggleButton {
  /**
   * @param {PomodoroToggleButtonProps} props
   */
  constructor (props) {
    /** @type {PomodoroToggleButtonProps} */
    this.props = props;

    this._initialized = false;

    const { el } = this.props;

    /** @type {SVGPathElement} */
    this._elStart = findElement(el, 'start');

    /** @type {SVGPathElement} */
    this._elStop = findElement(el, 'stop');

    this._render();
    this._initialized = true;
  }

  /**
   * @param {Partial<PomodoroToggleButtonProps>} props
   */
  updateProps (props) {
    this.props = {
      ...this.props,
      ...props,
    };
    this._render();
  }

  _render () {
    if (this._initialized) {
      if (this.props.el.animate) {
        this._animateSymbols(this.props.active);
      } else {
        this._elStart.dataset['inactive'] = String(this.props.active);
      }
    } else {
      this._elStart.dataset['inactive'] = 'false';
      this._elStop.dataset['inactive'] = 'true';
    }
  }

  /**
   * @param {boolean} active
   */
  _animateSymbols (active) {
    if (active) {
      this._animating = true;
      const animation = this._elStart.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.5)' },
      ], {
        duration: 300,
      });
      animation.onfinish = () => {
        this._elStart.dataset['inactive'] = 'true';
        this._elStop.dataset['inactive'] = 'true';
        this._animating = false;
      };
    } else {
      this._elStop.dataset['inactive'] = 'false';

      this._animating = true;
      const animStop = this._elStop.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.5)' },
      ], {
        duration: 300,
      });

      animStop.onfinish = () => {
        this._elStop.dataset['inactive'] = 'true';
      };

      setTimeout(() => {
        this._elStart.dataset['inactive'] = 'false';
        const animStart = this._elStart.animate([
          { opacity: 0, transform: 'scale(0.5)' },
          { opacity: 1, transform: 'scale(1)' },
        ], {
          duration: 300,
        });
        animStart.onfinish = () => {
          this._animating = false;
        };
      }, 200);
    }
  }
}
