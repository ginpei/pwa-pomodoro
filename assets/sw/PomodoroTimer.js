/// <reference path="../../node_modules/typescript/lib/lib.es2015.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.webworker.d.ts" />
/// <reference path="../../types/common.d.ts" />
/// <reference path="../../types/controller.d.ts" />

// eslint-disable-next-line no-undef
globalThis.PomodoroTimer = class PomodoroTimer {
  get elapse () {
    const elapse = (Date.now() - this._startedAt) % this.totalTime;
    return elapse;
  }

  get totalTime () {
    const { breakTime, workTime } = this.props.preferences;
    const totalTime = workTime + breakTime;
    return totalTime;
  }

  get progress () {
    const { totalTime } = this;
    const progress = (this.elapse % totalTime) / totalTime;
    return progress;
  }

  get threshold () {
    const { totalTime } = this;
    const { workTime } = this.props.preferences;
    const threshold = workTime / totalTime;
    return threshold;
  }

  get remainingTime () {
    const timeLength = this.props.preferences.workTime
      + (this.progress <= this.threshold
        ? 0
        : this.props.preferences.breakTime);
    const remainingTime = timeLength - this.elapse;
    return remainingTime;
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

  start () {
    this._startedAt = Date.now();
    const f = () => {
      this.props.onUpdate(this.progress, this.remainingTime);

      if (this.state.status === 'stop') {
        this._setStatus('working');
      } else if (this.state.status === 'working') {
        if (this.progress > this.threshold) {
          this._setStatus('breaking');
        }
      } else if (this.state.status === 'breaking') {
        if (this.progress < this.threshold) {
          this._setStatus('working');
        }
      } else {
        throw new Error('Unknown status has been set');
      }

      this._tm = setTimeout(f, 16);
    };
    f();
  }

  stop () {
    clearTimeout(this._tm);
    this._startedAt = 0;
    this._tm = 0;
    this._setStatus('stop');
  }

  /**
   * @param {number} progress
   */
  setProgress (progress) {
    const { totalTime } = this;
    this._startedAt = Date.now() - totalTime * progress;
  }

  /**
   * @param {PomodoroTimerStatus} status
   */
  _setStatus (status) {
    const oldStatus = this.state.status;
    this.state.status = status;
    this._dispatchStatusChange(status, oldStatus);
  }

  /**
   * @param {PomodoroTimerStatus} status
   * @param {PomodoroTimerStatus} oldStatus
   */
  _dispatchStatusChange (status, oldStatus) {
    this.props.onStatusChange(status, oldStatus);
  }
};
