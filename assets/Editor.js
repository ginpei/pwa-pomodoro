import { getButtonElement, getTextAreaElement } from "./misc.js";

export default class Editor {
  /**
   * @param {EditorOptions} options
   */
  constructor (options) {
    this.onOpenPreferencesClick = this.onOpenPreferencesClick.bind(this);
    this.onContentChange = this.onContentChange.bind(this);

    this.options = options;

    const { el } = this.options;
    this._elOpenPreferences = getButtonElement('.js-openPreferences', el);
    this._elContent = getTextAreaElement('.js-text', el);

    this._setUp();
  }

  destroy () {
    this._elOpenPreferences.removeEventListener(
      'click',
      this.onOpenPreferencesClick,
    );
    this._elContent.removeEventListener('input', this.onContentChange);
  }

  /**
   * @param {Preferences} pref
   */
  setPreferences (pref) {
    this._elContent.style.fontSize = `${pref.fontSize}px`;
    this._elContent.style.lineHeight = `${pref.lineHeight}`;
  }

  onOpenPreferencesClick () {
    this.options.onPreferences();
  }

  onContentChange () {
    const content = this._elContent.value;
    this._saveText(content);
  }

  _setUp () {
    const content = this._loadContent();

    this._elOpenPreferences.addEventListener(
      'click',
      this.onOpenPreferencesClick,
    );

    this._elContent.value = content;
    this._elContent.addEventListener('input', this.onContentChange);

    this.setPreferences(this.options.preferences);
  }

  /**
   * @param {string} html
   */
  _saveText (html) {
    window.localStorage.setItem('pwa-note/content', html);
  }

  _loadContent () {
    const html = window.localStorage.getItem('pwa-note/content') || '<p>Hello World!</div>';
    return html;
  }
}
