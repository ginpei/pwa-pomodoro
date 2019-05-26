export default class PomodoroClockHand {
  /**
   * @param {PomodoroClockHandProps} props
   */
  constructor (props) {
    /** @type {PomodoroClockHandProps} */
    this.props = props;

    this._lastDegree = -Infinity;

    this._renderHand();
    this._render();
  }

  /**
   * @param {Partial<PomodoroClockHandProps>} props
   */
  updateProps (props) {
    this.props = {
      ...this.props,
      ...props,
    };
    this._render();
  }

  _renderHand () {
    const ctx = this.props.el.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    const { height, width } = this.props.el;
    const cx = width / 2;
    const cy = height / 2;
    const thickness = 30;

    ctx.fillStyle = '#666';
    ctx.strokeStyle = '#fff9';
    ctx.lineWidth = 6;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    ctx.moveTo(cx, cy + (thickness / 2));
    ctx.lineTo(cx - (thickness / 2), cy);
    ctx.lineTo(cx - (thickness / 4), cy * 0.1);
    ctx.lineTo(cx + (thickness / 4), cy * 0.1);
    ctx.lineTo(cx + (thickness / 2), cy);

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  _render () {
    const { degree } = this.props;
    if (Math.abs(this._lastDegree - degree) > 0.1) {
      this._lastDegree = degree;
      this.props.el.style.setProperty('--degree', `${this.props.degree}deg`);
    }
  }
}
