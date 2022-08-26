import 'virtual:windi.css'
import 'virtual:windi-devtools'

import { initSettings } from "./modules/settings.js";

import { moduleId, SETTINGS, infoColor } from "./modules/constants.js";
import initHelpers from "crew-components/helpers";
import { logger, setting } from "crew-components/helpers";
import MainApplication from './view/MainApplication.js';
import BrowserApplication from './view/BrowserApplication.js';
import { initStores } from './modules/stores.js';
import { addTools } from "crew-components/helpers"
import { loadIcon } from "iconify-icon";


initHelpers(moduleId, infoColor, SETTINGS);
const app = new MainApplication();
const browser = new BrowserApplication();

import pf2e from "./systems/pf2e.js";
browser.addSystem(pf2e);
import dnd5e from "./systems/dnd5e.js";
browser.addSystem(dnd5e);

import common from "./systems/common.js";
browser.addSystem(common);

window.AlphaBrowser = browser;

Hooks.once('init', async () => {
  initSettings(app);
});

Hooks.on('getSceneControlButtons', (buttons) => {
  if (game.user.isGM) {
    addTools({
      name: "alpha-suit",
      title: "Alpha Suit",
      icon: "mdi:alpha",

      tools: [
        {
          name: "alpha-tree",
          title: "Toggle Tree",
          icon: "icon-park-solid:tree-list",
          visible: game.user.isGM,
          onClick: () => {
            app.toggle();
          },
          button: true
        }, {
          name: "alpha-browser",
          title: "Toggle Browser",
          icon: "ph:books-fill",
          visible: game.user.isGM,
          onClick: () => {
            browser.toggle();
          },
          button: true
        }
      ]
    });

    // buttons.push({
    //   name: "alpha-suit",
    //   title: "Alpha Suit",
    //   icon: "fas alpha-hud-icon",
    //   layer: "tokens",
    //   visible: game.user.isGM,
    //   activeTool: "select",
    // });
  }
});

Hooks.once('ready', async () => {
  if (game.user.isGM) {
    initStores();
    app.start();
    if (setting(SETTINGS.SHOW_TREE)) app.show();

    browser.start();
    if (setting(SETTINGS.SHOW_BROWSER)) browser.show();
    logger.info("Started!")
  }
}
);
