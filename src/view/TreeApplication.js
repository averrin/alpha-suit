import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import { logger, setting } from "crew-components/helpers";
import { moduleId, SETTINGS } from "../modules/constants.js";

import TreeUI from "./TreeUI.svelte";

export default class TreeApplication extends SvelteApplication {

  constructor() {
    super({ widgetId: "alpha-tree" });
    globalThis.Hooks.on("closeTreeApplication", () => {
      globalThis.game.settings.set(moduleId, SETTINGS.SHOW_TREE, false);
    });

    Hooks.on("canvasInit", () => {
      Hooks.once("renderCombatTracker", this.onUpdate.bind(this));
    });
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "alpha-tree",
      resizable: true,
      minimizable: true,
      zIndex: 95,
      title: "Alpha Tree",

      svelte: {
        class: TreeUI,
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
    Hooks.call("AlphaTreeToggleCollapse");
  }

  toggle() {
    if (setting(SETTINGS.SHOW_TREE)) {
      this.hide();
    } else {
      this.show();
    }
  }

  async show() {
    await this.render(true);
    globalThis.game.settings.set(moduleId, SETTINGS.SHOW_TREE, true);
  }
  async hide() {
    await this.close(true);
    globalThis.game.settings.set(moduleId, SETTINGS.SHOW_TREE, false);
  }

  onUpdate() {
  }
}
