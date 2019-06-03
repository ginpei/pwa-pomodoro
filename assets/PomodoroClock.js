import { eventToPosition, findElement, measureDistance, posString, measureDegree, getPosDiff } from "./misc.js";

export default class PomodoroClock {
  /** @type {Pos} */
  get center () {
    const { el } = this.props;
    const center = {
      x: el.offsetLeft + el.clientWidth / 2,
      y: el.offsetTop + el.clientHeight / 2
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
  constructor(props) {
    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    /** @type {PomodoroClockProps} */
    this.props = props;

    this._dragging = false;

    const { el } = this.props;

    el.addEventListener("click", this.onClick);
    el.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);

    /** @type {SVGPathElement} */
    this._elStart = findElement(el, "start");

    /** @type {SVGPathElement} */
    this._elStop = findElement(el, "stop");

    this._render();
  }

  destroy() {
    const { el } = this.props;
    el.removeEventListener("click", this.onClick);
    el.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  /**
   * @param {Partial<PomodoroClockProps>} props
   */
  updateProps(props) {
    this.props = {
      ...this.props,
      ...props
    };
    this._render();
  }

  onClick() {
    if (this._animating || this._dragging) {
      return;
    }

    this.props.onClick(this.props.active);
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseDown(event) {
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
   * @param {MouseEvent} event
   */
  onMouseMove(event) {
    if (this._dragging) {
      const { el } = this.props;
      const pos = eventToPosition(event);
      const dPos = getPosDiff(pos, this.center);
      const degree = measureDegree(dPos);
      this.props.onTurn(degree);
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseUp(event) {
    if (this._dragging) {
      event.preventDefault();

      setTimeout(() => {
        this._dragging = false;
      }, 1);
    }
  }

  _render() {
  }

  /**
   * @param {boolean} active
   */
  _animateSymbols(active) {
    if (active) {
      this._animating = true;
      const animation = this._elStart.animate(
        [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(1.5)" }
        ],
        {
          duration: 300
        }
      );
      animation.onfinish = () => {
        this._elStart.dataset["inactive"] = "true";
        this._elStop.dataset["inactive"] = "true";
        this._animating = false;
      };
    } else {
      this._elStop.dataset["inactive"] = "false";

      this._animating = true;
      const animStop = this._elStop.animate(
        [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(1.5)" }
        ],
        {
          duration: 300
        }
      );

      animStop.onfinish = () => {
        this._elStop.dataset["inactive"] = "true";
      };

      setTimeout(() => {
        this._elStart.dataset["inactive"] = "false";
        const animStart = this._elStart.animate(
          [
            { opacity: 0, transform: "scale(0.5)" },
            { opacity: 1, transform: "scale(1)" }
          ],
          {
            duration: 300
          }
        );
        animStart.onfinish = () => {
          this._animating = false;
        };
      }, 200);
    }
  }
}
