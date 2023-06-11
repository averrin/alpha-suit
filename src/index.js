import {isPremium} from "crew-components/premium"
import "crew-components/styles/foundry-fixes.scss";
import "crew-components/styles/alpha-ui.scss";
import "crew-components/styles/global.scss";
import "crew-components/styles/themes.scss";
import "./main.scss";
import "iconify-icon";

import { moduleId, SETTINGS, infoColor } from "./modules/constants.js";

import { get } from "svelte/store"
import initHelpers, { logger, moduleId as mid } from "crew-components/helpers";
import { initStores as helperStores } from "crew-components/stores";

import { initSettings } from "./modules/settings.js";
import { initStores } from './modules/stores.js';
import { initIndex } from "./modules/file_index";
import { initSettingsTopics } from "./modules/settings_content";
import { createApps, getApp, startGMApps, startUserApps } from "./apps";
import { getTool, initTools } from "./tools";
import "./systems.js";
import { createAPI } from "./api.js";
import GridUI_inline from "./view/GridUI_inline.svelte"

import NotificationsApp from "./view/Notifications.js"
import CreateApplication from "crew-components/AlphaApplication";

initHelpers(moduleId, infoColor, SETTINGS);
createApps();
createAPI()

Hooks.once('init', async () => {
  initSettings();
  initSettingsTopics()


  game.keybindings.register(moduleId, SETTINGS.KEY_TOGGLE_TREE, {
    name: 'Alpha Tree',
    editable: [{ key: 'KeyT', modifiers: [KeyboardManager.MODIFIER_KEYS.ALT] }],
    namespace: 'Alpha Suit',
    onDown: () => {
      getApp("tree").toggle();
    }
  });
  game.keybindings.register(moduleId, SETTINGS.KEY_TOGGLE_GRID, {
    name: 'Alpha Grid',
    editable: [{ key: 'KeyG', modifiers: [KeyboardManager.MODIFIER_KEYS.ALT] }],
    namespace: 'Alpha Suit',
    onDown: () => {
      getApp("grid").toggle();
    }
  });
  game.keybindings.register(moduleId, SETTINGS.KEY_TOGGLE_DRAW, {
    name: 'Alpha Draw',
    editable: [{ key: 'KeyQ', modifiers: [] }],
    namespace: 'Alpha Suit',
    onDown: () => {
      getApp("draw").toggle();
    }
  });

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

function addSidebarTab(id, appSpec) {
  const tabs = document.getElementById("sidebar-tabs");
  const tab = document.createElement("a")
  tab.classList.add("item")
  tab.dataset.tab = id
  const icon = document.createElement("i")
  icon.classList.add("fas")
  icon.classList.add("fa-icons")
  tab.appendChild(icon)
  tabs.prepend(tab)

  const sidebar = document.getElementById("sidebar");
  const section = document.createElement("section")
  section.classList.add("sidebar-tab")
  section.classList.add("tab")
  section.id = id
  section.dataset.tab = id
  sidebar.appendChild(section);

  //TODO: rework resizing
  document.querySelector(':root').style.setProperty("--sidebar-width", "360px");

  const igApp = new (CreateApplication(appSpec))();
  igApp.start();
  igApp.show()
}

Hooks.once('ready', () => {
  helperStores()
  initStores();
  startUserApps()

    if (isPremium() && game.settings.get(moduleId, SETTINGS.GRID_IN_SIDEBAR)) {
      const inlineGrid = { moduleId: "alpha-suit", isTemp: true, app_id: "grid", target: "#grid", title: "Alpha Grid [ALPHA]", component: GridUI_inline }
      addSidebarTab("grid", inlineGrid)
    }

  if (game.user.isGM) {
    startGMApps()

    new NotificationsApp().render(true);
    logger.info(`Started! Version: ${game.modules.get("alpha-suit").data.version}`)

    Hooks.call("AlphaSuitStarted");
    initIndex();

  }
});
