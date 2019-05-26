export default class PomodoroTimer {
  get progress () {
    const { cycle } = this.props;
    const elapse = Date.now() - this._startedAt;
    const progress = (elapse % cycle) / cycle;
    return progress;
  }

  /**
   * @param {PomodoroTimerProps} props
   */
  constructor(props) {
    /** @type {PomodoroTimerProps} */
    this.props = props;
    this._startedAt = 0;
    this._tm = 0;
  }

  /**
   * @param {Partial<PomodoroTimerProps>} props
   */
  updateProps (props) {
    this.props = {
      ...this.props,
      ...props,
    };

    // restart if running
    if (this._tm !== 0) {
      this.stop();
      this.start();
    }
  }

  start() {
    this._startedAt = Date.now();
    const f = () => {
      this.props.onUpdate(this.progress);
      this._tm = requestAnimationFrame(f);
    };
    f();
  }

  stop() {
    window.cancelAnimationFrame(this._tm);
    this._startedAt = 0;
    this._tm = 0;
  }
}
