import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import { TJSGameSettings } from '@typhonjs-fvtt/runtime/svelte/store';
import { moduleId, SETTINGS } from '../../modules/constants.js';

export default class WidgetApp extends SvelteApplication {
  #gameSettings = new TJSGameSettings();

  constructor(options) {
    super(options);
    this.widgetId = options.widgetId;

    this.#gameSettings.register({
      moduleId,
      key: `${SETTINGS.POSITION_PREFIX}-${options.widgetId}`,
      options: {
        scope: 'client',
        config: false,
        default: {},
        type: Object
      }
    });

    this.enabled = game.settings.get(moduleId, `${SETTINGS.SHOW_PREFIX}-${options.widgetId}`);
    try {
      // Attempt to parse session storage item and set to Position.
      this.position = game.settings.get(moduleId, `${SETTINGS.POSITION_PREFIX}-${options.widgetId}`);
    }
    catch (err) {
      console.warn("cannot read saved position")
    }
  }

  getPositionStore() {
    return this.#gameSettings.getStore(`${SETTINGS.POSITION_PREFIX}-${this.widgetId}`);
  }


  async refresh() {
    this.enabled = game.settings.get(moduleId, `${SETTINGS.SHOW_PREFIX}-${this.widgetId}`);
    if (this.enabled) await this.render(true);
    else await this.close();
  }
  async show() {
    this.enabled = game.settings.get(moduleId, `${SETTINGS.SHOW_PREFIX}-${this.widgetId}`);
    if (this.enabled) {
      await this.render(true);
      setTimeout(this.onUpdateTokens.bind(this), 0);
    }
  }

  async hide() {
    await this.close();
  }

  setSystem(provider) {
    this.system = provider;
    this.svelte.applicationShell.system = this.system;
  }

  installHooks() {
  }
}
