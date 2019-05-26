export default class PomodoroTimer {
  get progress () {
    const { restTime, workTime } = this.props.pomodoroState;
    const totalTime = workTime + restTime;
    const elapse = Date.now() - this._startedAt;
    const progress = (elapse % totalTime) / totalTime;
    return progress;
  }

  get threshold () {
    const { restTime, workTime } = this.props.pomodoroState;
    const totalTime = workTime + restTime;
    const threshold = workTime / totalTime;
    return threshold;
  }

  /**
   * @param {PomodoroTimerProps} props
   */
  constructor (props) {
    /** @type {PomodoroTimerProps} */
    this.props = props;

    /** @type {PomodoroTimerState} */
    this.state = {
      status: 'stop',
    };

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

      if (this.state.status === 'stop') {
        this._setStatus('working');
      } else if (this.state.status === 'working') {
        if (this.progress > this.threshold) {
          this._setStatus('resting');
        }
      } else if (this.state.status === 'resting') {
        if (this.progress < this.threshold) {
          this._setStatus('working');
        }
      } else {
        throw new Error('Unknown status has been set');
      }

      this._tm = requestAnimationFrame(f);
    };
    f();
  }

  stop() {
    window.cancelAnimationFrame(this._tm);
    this._startedAt = 0;
    this._tm = 0;
    this._setStatus('stop');
  }

  /**
   * @param {PomodoroTimerStatus} status
   */
  _setStatus (status) {
    const oldStatus = this.state.status;
    this.state.status = status;
    this._dispatchStatusChange(oldStatus);
  }

  /**
   * @param {PomodoroTimerStatus} oldStatus
   */
  _dispatchStatusChange (oldStatus) {
    this.props.onStatusChange(this.state.status, oldStatus);
  }
}
