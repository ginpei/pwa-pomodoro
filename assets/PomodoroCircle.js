import { degToRad } from './misc.js';

export default class PomodoroCircle {
  /**
   * @param {PomodoroCircleProps} props
   */
  constructor (props) {
    this.props = props;

    this._render();
  }

  destroy () {
    // do nothing for now
  }

  /**
   * @param {Partial<PomodoroCircleProps>} props
   */
  updateProps (props) {
    /** @type {PomodoroCircleProps} */
    this.props = {
      ...this.props,
      ...props,
    };

    this._render();
  }

  _render () {
    const { el, pomodoroState: ps } = this.props;
    const rate = ps.workTime / (ps.breakTime + ps.workTime);
    const point = rate * 360;

    this._renderCircle(el, 0, point, 'orange');
    this._renderCircle(el, point, 360, 'green');
  }

  /**
   * @param {HTMLCanvasElement} elCanvas
   * @param {number} deg1
   * @param {number} deg2
   * @param {string} fillStyle
   */
  _renderCircle (elCanvas, deg1, deg2, fillStyle) {
    const ctx = elCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    const { height, width } = elCanvas;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(height, width) * 0.5;
    const thickness = radius / 4;

    ctx.beginPath();

    // outer stroke
    ctx.arc(cx, cy, radius, degToRad(deg1), degToRad(deg2));

    // inner stroke
    ctx.lineTo(
      cx + (radius - thickness) * Math.cos(degToRad(deg2)),
      cy + (radius - thickness) * Math.sin(degToRad(deg2)),
    );
    ctx.arc(cx, cy, radius - thickness, degToRad(deg2), degToRad(deg1), true);

    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
}
