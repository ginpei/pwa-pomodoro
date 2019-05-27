export default class PomodoroToggleButton {
  /**
   * @param {PomodoroToggleButtonProps} props
   */
  constructor (props) {
    /** @type {PomodoroToggleButtonProps} */
    this.props = props;

    props.el.addEventListener('click', props.onClick);
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
    this.props.el.dataset['hidden'] = String(this.props.active);
  }
}
