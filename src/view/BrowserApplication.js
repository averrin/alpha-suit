import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import { logger, setting } from "crew-components/helpers";
import { moduleId, SETTINGS } from "../modules/constants.js";
import { systems } from "../modules/stores.js";

import BrowserUI from "./BrowserUI.svelte";

export default class BrowserApplication extends SvelteApplication {

  constructor() {
    super({ widgetId: "alpha-browser" });
    globalThis.Hooks.on("closeBrowserApplication", () => {
      globalThis.game.settings.set(moduleId, SETTINGS.SHOW_BROWSER, false);
    });

    Hooks.on("canvasInit", () => {
      Hooks.once("renderCombatTracker", this.onUpdate.bind(this));
    });
  }

  addSystem(system) {
    systems.update(s => {
      s[system.id] = system;
      return s;
    })
    logger.info(`System added: ${system.id}`);
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "alpha-browser",
      resizable: true,
      minimizable: true,
      zIndex: 95,
      title: "Alpha Browser",

      svelte: {
        class: BrowserUI,
        target: document.body,
        props: function() {
          return {};
        },
      },
    });
  }

  start() {
    // initAPI();
  }

  toggleCollapsed() {
    Hooks.call("AlphaBrowserToggleCollapse");
  }

  toggle() {
    if (setting(SETTINGS.SHOW_BROWSER)) {
      this.hide();
    } else {
      this.show();
    }
  }

  async show() {
    await this.render(true);
    globalThis.game.settings.set(moduleId, SETTINGS.SHOW_BROWSER, true);
  }
  async hide() {
    await this.close(true);
    globalThis.game.settings.set(moduleId, SETTINGS.SHOW_BROWSER, false);
  }

  onUpdate() {
  }
}
