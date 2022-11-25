import "crew-components/styles/foundry-fixes.scss";
import "crew-components/styles/alpha-ui.scss";
import "crew-components/styles/global.scss";
import "crew-components/styles/themes.scss";
import "./main.scss";
import "iconify-icon";

import { moduleId, SETTINGS, infoColor } from "./modules/constants.js";

import {get} from "svelte/store"
import initHelpers, { logger, moduleId as mid } from "crew-components/helpers";
import { initStores as helperStores } from "crew-components/stores";

import { initSettings } from "./modules/settings.js";
import { initStores } from './modules/stores.js';
import { initIndex } from "./modules/file_index";
import { initSettingsTopics } from "./modules/settings_content";
import { createApps, getApp, startGMApps, startUserApps } from "./apps";
import { getTool, initTools } from "./tools";
import "./systems.js";
import {createAPI} from "./api.js";

import NotificationsApp from "./view/Notifications.js"

initHelpers(moduleId, infoColor, SETTINGS);
createApps();
createAPI()

Hooks.once('init', async () => {
  initSettings();
  initSettingsTopics()

  game.settings.registerMenu(moduleId, "configure-settings", {
    name: "",
    label: "Alpha Settings",
    icon: "fas fa-cog",
    type: getApp("settings").makeShim(),
    restricted: false
  });
});

Hooks.on('renderSceneControls', _ => {
  const gt = getTool("alpha-grid-btn");
  if (gt) {
    gt.isGM = !game.settings.get(moduleId, SETTINGS.GRID_FOR_PLAYERS);
  }
  initTools();
});

Hooks.once('ready', () => {
  helperStores()
  initStores();
  startUserApps()

  if (game.user.isGM) {
    startGMApps()

    new NotificationsApp().render(true);
    logger.info(`Started! Version: ${game.modules.get("alpha-suit").data.version}`)

    Hooks.call("AlphaSuitStarted");
    initIndex();

  }
});
