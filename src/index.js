import "crew-components/styles/foundry-fixes.scss";
import "crew-components/styles/alpha-ui.scss";
import "crew-components/styles/global.scss";
import "crew-components/styles/themes.scss";
import "./main.scss";

import { initSettings } from "./modules/settings.js";
import CreateApplication from './view/AlphaApplication.js';

import { moduleId, SETTINGS, infoColor } from "./modules/constants.js";
import initHelpers from "crew-components/helpers";
import { logger, setting } from "crew-components/helpers";
import BrowserUI from './view/BrowserUI.svelte';
import TreeUI from './view/TreeUI.svelte';
import HelpUI from './view/HelpUI.svelte';
import SettingsUI from './view/SettingsUI.svelte';
import FilesUI from './view/FilesUI.svelte';
import HUDApplication from './view/HUDApplication.js';
import { initStores, buildHelpTree, helpTree, addSystem } from './modules/stores.js';
import { addTools } from "crew-components/helpers"
import { loadIcon } from "iconify-icon";
import { helpContent } from "./modules/help_content.js"

import DirectorWidget from "./view/hud/widgets/DirectorWidget.js"
// import CharacterWidget from "./view/hud/widgets/CharactersWidget.js"


initHelpers(moduleId, infoColor, SETTINGS);
const tree = new (CreateApplication("tree", "Alpha Tree", TreeUI))();
const browser = new (CreateApplication("browser", "Alpha Browser", BrowserUI))();
const help = new (CreateApplication("help", "Alpha Help Center", HelpUI))();
const settings = new (CreateApplication("settings", "Alpha Settings", SettingsUI))();
const files = new (CreateApplication("files", "Alpha File Manager", FilesUI))();
const hud = new HUDApplication();

import pf2e from "./systems/pf2e.js";
addSystem(pf2e);
import dnd5e from "./systems/dnd5e.js";
addSystem(dnd5e);

import common from "./systems/common.js";
addSystem(common);

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
      toggle: true,
      isActive: _ => setting("show-tree"),
    },
    {
      name: "alpha-browser-btn",
      title: "Toggle Browser",
      icon: "ph:books-fill",
      onClick: async () => {
        await browser.toggle();
      },
      toggle: true,
      isActive: _ => setting("show-browser"),
    },
    {
      name: "alpha-settings",
      title: "Settings",
      icon: "fa6-solid:gears",
      onClick: () => {
        settings.toggle();
      },
      toggle: true,
      isActive: _ => setting("show-settings"),
    },
    {
      name: "alpha-help-btn",
      title: "Toggle Help Center",
      icon: "clarity:help-solid",
      onClick: () => {
        help.toggle();
      },
      toggle: true,
      isActive: _ => setting("show-help"),
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
    browser.start();
    help.start();
    settings.start();
    files.start();

    if (globalThis.game.modules.get("director")?.active) {
      hud.add(new DirectorWidget());
    }
    // hud.add(new CharacterWidget());
    hud.start();
    if (setting(SETTINGS.SHOW_HUD)) hud.show();


    logger.info(`Started! Version: ${game.modules.get("alpha-suit").data.version}`)

    if (setting(SETTINGS.DEV_FEATURES)) {
      tools.tools.push(...[
        {
          name: "alpha-hud-btn",
          title: "Toggle Alpha HUD",
          icon: "ic:twotone-widgets",
          onClick: () => {
            hud.toggle();
          },
          toggle: true,
          isActive: _ => setting("show-hud"),
        },
        {
          name: "alpha-files",
          title: "Alpha File Manager",
          icon: "fa6-solid:folder",
          onClick: () => {
            files.toggle();
          },
          toggle: true,
          isActive: _ => setting("show-files"),
        },
      ])
    }
  }
}
);
