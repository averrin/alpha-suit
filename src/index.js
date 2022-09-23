// import 'virtual:windi-devtools'

import { initSettings } from "./modules/settings.js";

import { moduleId, SETTINGS, infoColor } from "./modules/constants.js";
import initHelpers from "crew-components/helpers";
import { logger, setting } from "crew-components/helpers";
import TreeApplication from './view/TreeApplication.js';
import BrowserApplication from './view/BrowserApplication.js';
import HelpApplication from './view/HelpApplication.js';
import HUDApplication from './view/HUDApplication.js';
import SettingsApplication from './view/SettingsApplication.js';
import { initStores, buildHelpTree, helpTree } from './modules/stores.js';
import { addTools } from "crew-components/helpers"
import { loadIcon } from "iconify-icon";
import { helpContent } from "./modules/help_content.js"

import DirectorWidget from "./view/hud/widgets/DirectorWidget.js"
// import CharacterWidget from "./view/hud/widgets/CharactersWidget.js"


initHelpers(moduleId, infoColor, SETTINGS);
const tree = new TreeApplication();
const browser = new BrowserApplication();
const help = new HelpApplication();
const hud = new HUDApplication();
const settings = new SettingsApplication();

import pf2e from "./systems/pf2e.js";
browser.addSystem(pf2e);
import dnd5e from "./systems/dnd5e.js";
browser.addSystem(dnd5e);

import common from "./systems/common.js";
browser.addSystem(common);

const tools = {
  name: "alpha-suit",
  title: "Alpha Suit",
  icon: "mdi:alpha",

  tools: [
    {
      name: "alpha-tree-btn",
      title: "Toggle Tree",
      icon: "icon-park-solid:tree-list",
      onClick: () => {
        tree.toggle();
      },
    },
    {
      name: "alpha-browser-btn",
      title: "Toggle Browser",
      icon: "ph:books-fill",
      onClick: () => {
        browser.toggle();
      },
    },
    // {
    //   name: "alpha-hud-btn",
    //   title: "Toggle Alpha HUD",
    //   icon: "ic:twotone-widgets",
    //   onClick: () => {
    //     hud.toggle();
    //   },
    // },
    {
      name: "alpha-settings",
      title: "Settings",
      icon: "fa6-solid:gears",
      onClick: () => {
        settings.toggle();
      },
    },
    {
      name: "alpha-help-btn",
      title: "Toggle Help Center",
      icon: "clarity:help-solid",
      onClick: () => {
        help.toggle();
      },
    },
  ]
}
/* ic:twotone-widgets */

window.AlphaSuit = {
  showHelp: help.show.bind(help),
  addTool: (tool) => {
    tools.tools.push(tool);
  },
  addHelp: (data) => {
    helpContent.children.push(data);
    helpTree.set(buildHelpTree())
  }
}

Hooks.once('init', async () => {
  initSettings(tree);
});

Hooks.on('renderSceneControls', (_) => {
  if (game?.user?.isGM) {
    if (!document.querySelector(`[data-control='${tools.name}']`)) {
      addTools(tools);
    }
  }
});

Hooks.once('ready', async () => {
  if (game.user.isGM) {
    initStores();
    tree.start();
    if (setting(SETTINGS.SHOW_TREE)) tree.show();

    browser.start();
    if (setting(SETTINGS.SHOW_BROWSER)) browser.show();

    help.start();
    if (setting(SETTINGS.SHOW_HELP)) help.show();

    if (globalThis.game.modules.get("director")?.active) {
      hud.add(new DirectorWidget());
    }

    // hud.add(new CharacterWidget());

    hud.start();
    if (setting(SETTINGS.SHOW_HUD)) hud.show();

    settings.start();
    if (setting(SETTINGS.SHOW_SETTINGS)) settings.show();

    logger.info("Started!")
  }
}
);
