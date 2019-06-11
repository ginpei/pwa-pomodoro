import {
  eventToPosition, findElement, getPosDiff, measureDegree, measureDistance,
} from './misc.js';
import PomodoroCircle from './PomodoroCircle.js';

export default class PomodoroClock {
  /** @type {Pos} */
  get center () {
    const { el } = this.props;
    const center = {
      x: el.offsetLeft + el.clientWidth / 2,
      y: el.offsetTop + el.clientHeight / 2,
    };
    return center;
  }

  /** @type {number} */
  get minLength () {
    const { el } = this.props;
    const min = Math.min(el.clientWidth, el.clientHeight);
    return min;
  }

  /**
   * @param {PomodoroClockProps} props
   */
  constructor (props) {
    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    /** @type {PomodoroClockProps} */
    this.props = props;

    this._dragging = false;

    const { el } = this.props;

    this.circle = new PomodoroCircle({
      el: findElement(el, 'circle'),
      pomodoroState: this.props.pomodoroState,
    });

    el.addEventListener('click', this.onClick);
    el.addEventListener('mousedown', this.onMouseDown);
    el.addEventListener('touchstart', this.onTouchStart);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('touchmove', this.onTouchMove);
    document.addEventListener('touchend', this.onTouchEnd);

    /** @type {SVGPathElement} */
    this._elStart = findElement(el, 'start');

    /** @type {SVGPathElement} */
    this._elStop = findElement(el, 'stop');

    this._render();
  }

  destroy () {
    const { el } = this.props;
    el.removeEventListener('click', this.onClick);
    el.removeEventListener('mousedown', this.onMouseDown);
    el.removeEventListener('touchstart', this.onTouchStart);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  }

  /**
   * @param {Partial<PomodoroClockProps>} props
   */
  updateProps (props) {
    this.props = {
      ...this.props,
      ...props,
    };

    this.circle.updateProps({
      pomodoroState: this.props.pomodoroState,
    });

    this._render();
  }

  onClick () {
    if (this._animating || this._dragging) {
      return;
    }

    this.props.onClick(this.props.active);
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseDown (event) {
    this._handleDragStartEvent(event);
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseMove (event) {
    this._handleDragMoveEvent(event);
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseUp (event) {
    this._handleDragEndEvent(event);
  }

  /**
   * @param {TouchEvent} event
   */
  onTouchStart (event) {
    this._handleDragStartEvent(event);
  }

  /**
   * @param {TouchEvent} event
   */
  onTouchMove (event) {
    this._handleDragMoveEvent(event);
  }

  /**
   * @param {TouchEvent} event
   */
  onTouchEnd (event) {
    this._handleDragEndEvent(event);
  }

  _render () {
  }

  /**
   * @param {MouseEvent | TouchEvent} event
   */
  _handleDragStartEvent (event) {
    if (this.props.active) {
      const pos = eventToPosition(event);
      const distance = measureDistance(this.center, pos);

      const min = this.minLength * 0.4;
      const max = this.minLength * 0.5;
      if (min < distance && distance < max) {
        event.preventDefault();
        this._dragging = true;
      }
    }
  }

  /**
   * @param {MouseEvent | TouchEvent} event
   */
  _handleDragMoveEvent (event) {
    if (this._dragging) {
      const pos = eventToPosition(event);
      const dPos = getPosDiff(pos, this.center);
      const degree = measureDegree(dPos);
      this.props.onTurn(degree);
    }
  }

  /**
   * @param {MouseEvent | TouchEvent} event
   */
  _handleDragEndEvent (event) {
    if (this._dragging) {
      event.preventDefault();

      setTimeout(() => {
        this._dragging = false;
      }, 1);
    }
  }

  /**
   * @param {Pos} pos
   */
  _isPointOnTrack (pos) {
    const distance = measureDistance(this.center, pos);

    const min = this.minLength * 0.4;
    const max = this.minLength * 0.5;
    const onTrack = min < distance && distance < max;
    return onTrack;
  }

  /**
   * @param {boolean} active
   */
  _animateSymbols (active) {
    if (active) {
      this._animating = true;
      const animation = this._elStart.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(1.5)' },
        ],
        {
          duration: 300,
        },
      );
      animation.onfinish = () => {
        this._elStart.dataset.inactive = 'true';
        this._elStop.dataset.inactive = 'true';
        this._animating = false;
      };
    } else {
      this._elStop.dataset.inactive = 'false';

      this._animating = true;
      const animStop = this._elStop.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(1.5)' },
        ],
        {
          duration: 300,
        },
      );

      animStop.onfinish = () => {
        this._elStop.dataset.inactive = 'true';
      };

      setTimeout(() => {
        this._elStart.dataset.inactive = 'false';
        const animStart = this._elStart.animate(
          [
            { opacity: 0, transform: 'scale(0.5)' },
            { opacity: 1, transform: 'scale(1)' },
          ],
          {
            duration: 300,
          },
        );
        animStart.onfinish = () => {
          this._animating = false;
        };
      }, 200);
    }
  }
}
