export default class Chime {
  /**
   * @param {ChimeProps} props
   */
  constructor (props) {
    /** @type {ChimeProps} */
    this.props = props;

    this.el = document.createElement('audio');
    this.el.src = 'assets/vendor/nhk-creative-library/D0002011518_00000_A_001.m4a';
  }

  /**
   * @param {Partial<ChimeProps>} props
   */
  updateProps (props) {
    this.props = {
      ...this.props,
      ...props,
    };
  }

  play () {
    this.stop();
    this.el.play();
  }

  stop () {
    this.el.pause();
    this.el.currentTime = 0;
  }

  toggle () {
    if (this.el.paused) {
      this.play();
    } else {
      this.stop();
    }
  }
}
