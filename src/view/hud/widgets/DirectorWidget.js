import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import DirectorWidget from './DirectorWidget.svelte';
import WidgetApp from '../Widget.js';
import { directorActionsStore } from '../../../modules/stores.js';

export default class DirectorWidgetApp extends WidgetApp {
  #HOOKS = [
    'DirectorUpdateActions',
  ];

  constructor(options) {
    super({ widgetId: "directorWidget" });
    logger.info("director widget js");
  }

  /**
  * Default Application options
  *
  * @returns {object} options - Application options.
  * @see https://foundryvtt.com/api/Application.html#options
  */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 'auto',
      height: 'auto',
      resizable: false,
      minimizable: false,
      headerButtonNoClose: true,
      popOut: false,
      zIndex: 95,

      svelte: {
        class: DirectorWidget,
        target: document.body,
        props: function() {
          return {
            settingStore: this.getPositionStore(),
            widgetId: this.widgetId,
            actions: directorActionsStore,
          };
        }
      }
    });
  }

  installHooks() {
    for (let hook of this.#HOOKS) {
      Hooks.on(hook, this.onUpdateTokens.bind(this));
    }
  }

  async refresh() {
    await super.refresh();
  }

  onUpdateTokens(actions) {
    // if(!this.enabled) return;
    if (this.svelte.applicationShell) {
      this.svelte.applicationShell.widgetId = this.widgetId;
    }
    if (actions) {
      directorActionsStore.set(actions);
    } else {
      directorActionsStore.set((canvas.scene?.flags || canvas.scene?.data.flags)["director-actions"]);
    }
  }
}

