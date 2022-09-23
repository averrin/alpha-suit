import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import { logger, setting } from "crew-components/helpers";
import { moduleId, SETTINGS } from "../modules/constants.js";

import HelpUI from "./HelpUI.svelte";

export default class HelpApplication extends SvelteApplication {

  constructor() {
    super({ widgetId: "alpha-help" });
    globalThis.Hooks.on("closeHelpApplication", () => {
      globalThis.game.settings.set(moduleId, SETTINGS.SHOW_HELP, false);
    });
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "alpha-help",
      resizable: true,
      minimizable: true,
      zIndex: 95,
      title: "Alpha Help",
      width: 800,
      height: 600,

      svelte: {
        class: HelpUI,
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
    Hooks.call("AlphaHelpToggleCollapse");
  }

  toggle() {
    if (setting(SETTINGS.SHOW_HELP)) {
      this.hide();
    } else {
      this.show();
    }
  }

  async show() {
    await this.render(true);
    globalThis.game.settings.set(moduleId, SETTINGS.SHOW_HELP, true);
  }
  async hide() {
    await this.close(true);
    globalThis.game.settings.set(moduleId, SETTINGS.SHOW_HELP, false);
  }

  onUpdate() {
  }
}
