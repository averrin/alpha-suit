import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";

import Notifications from "./Notifications.svelte";

let window_removed = false;
export default class NotificationsApp extends SvelteApplication {

  constructor() {
    super({ widgetId: "notifications" });
    setTimeout(_ => this.removeWindow(), 1000);
  }

  removeWindow() {
    if (window_removed) return;
    if (!ui.windows[this.appId]) {
      setTimeout(_ => this.removeWindow(), 1000);
    } else {
      delete ui.windows[this.appId];
      window_removed = true;
    }
  }


  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "alpha-suit-notifications",
      positionable: false,

      svelte: {
        class: Notifications,
        target: document.body,
        props: function() {
          return {};
        },
      },
    });
  }
}

