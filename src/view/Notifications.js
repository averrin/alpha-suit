import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";

import Notifications from "./Notifications.svelte";

export default class NotificationsApp extends SvelteApplication {

  constructor() {
    super({ widgetId: "notifications" });
    setTimeout(_ => delete ui.windows[this.appId], 1000);
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

