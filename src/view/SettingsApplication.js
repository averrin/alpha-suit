import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import { logger, setting } from "crew-components/helpers";
import { moduleId, SETTINGS } from "../modules/constants.js";

import SettingsUI from "./SettingsUI.svelte";

export default class SettingsApplication extends SvelteApplication {

  constructor() {
    super({ widgetId: "alpha-settings" });
    globalThis.Hooks.on("closeSettingsApplication", () => {
      globalThis.game.settings.set(moduleId, SETTINGS.SHOW_SETTINGS, false);
    });
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "alpha-settings",
      resizable: true,
      minimizable: true,
      zIndex: 95,
      title: "Alpha Settings",
      width: 800,
      height: 600,

      svelte: {
        class: SettingsUI,
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
    Hooks.call("AlphaSettingsToggleCollapse");
  }

  toggle() {
    if (setting(SETTINGS.SHOW_SETTINGS)) {
      this.hide();
    } else {
      this.show();
    }
  }

  async show() {
    await this.render(true);
    globalThis.game.settings.set(moduleId, SETTINGS.SHOW_SETTINGS, true);
  }
  async hide() {
    await this.close(true);
    globalThis.game.settings.set(moduleId, SETTINGS.SHOW_SETTINGS, false);
  }

  onUpdate() {
  }
}

