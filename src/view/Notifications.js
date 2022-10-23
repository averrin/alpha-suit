import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";

import Notifications from "./Notifications.svelte";

export default class NotificationsApp extends SvelteApplication {

  constructor() {
    super({ widgetId: "notifications" });
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

