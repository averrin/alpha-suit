import "crew-components/styles/foundry-fixes.scss";
import "crew-components/styles/alpha-ui.scss";
import "crew-components/styles/global.scss";
import "crew-components/styles/themes.scss";
import "./main.scss";

import { initSettings } from "./modules/settings.js";
import CreateApplication from 'crew-components/AlphaApplication';

import { moduleId, SETTINGS, infoColor } from "./modules/constants.js";
import initHelpers from "crew-components/helpers";
import { logger, setting } from "crew-components/helpers";
import BrowserUI from './view/BrowserUI.svelte';
import TreeUI from './view/TreeUI.svelte';
import HelpUI from './view/HelpUI.svelte';
import SettingsUI from './view/SettingsUI.svelte';
import FilesUI from './view/FilesUI.svelte';
import HUDApplication from './view/HUDApplication.js';

import GridUI from './view/GridUI.svelte';

import { initStores, buildHelpTree, helpTree, addSystem } from './modules/stores.js';
import { addTools } from "crew-components/helpers"
import { loadIcon } from "iconify-icon";
import { helpContent } from "./modules/help_content.js"
import NotificationsApp from "./view/Notifications.js"
import { initStores as helperStores } from "crew-components/stores";

import DirectorWidget from "./view/hud/widgets/DirectorWidget.js"
import DirectorSettings from "./view/settings/DirectorSettings.svelte";
import EffectEditorSettings from "./view/settings/EffectEditorSettings.svelte";
// import CharacterWidget from "./view/hud/widgets/CharactersWidget.js"


initHelpers(moduleId, infoColor, SETTINGS);
const tree = new (CreateApplication("tree", "Alpha Tree", TreeUI))();
const browser = new (CreateApplication("browser", "Alpha Browser", BrowserUI))();
const help = new (CreateApplication("help", "Alpha Help Center", HelpUI))();
const settings = new (CreateApplication("settings", "Alpha Settings", SettingsUI))();
const files = new (CreateApplication("files", "Alpha File Manager [BETA]", FilesUI))();
const grid = new (CreateApplication("grid", "Alpha Grid [ALPHA]", GridUI))();
const hud = new HUDApplication();

import pf2e from "./systems/pf2e.js";
addSystem(pf2e);
import dnd5e from "./systems/dnd5e.js";
addSystem(dnd5e);

import common from "./systems/common.js";
import { rebuildIndex } from "./modules/file_index";
import { notify } from "./modules/notify";
import { settingsContent } from "./modules/settings_content";
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
      name: "alpha-files",
      title: "Alpha File Manager",
      icon: "fa6-solid:folder",
      onClick: () => {
        files.toggle();
      },
      toggle: true,
      isActive: _ => setting("show-files"),
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

    // {
    //   name: "alpha-grid-btn",
    //   title: "Toggle Alpha Grid",
    //   icon: "ic:twotone-widgets",
    //   onClick: () => {
    //     grid.toggle();
    //   },
    //   toggle: true,
    //   isActive: _ => setting("show-grid"),
    // },
  ]
}
/* ic:twotone-widgets */

window.AlphaSuit = {
  showHelp: help.show.bind(help),
  showSettings: settings.show.bind(settings),
  addTool: (tool) => {
    tools.tools.push(tool);
  },
  addHelp: (data) => {
    helpContent.children.push(data);
    helpTree.set(buildHelpTree())
  },
  notify,
}

Hooks.once('init', async () => {
  initSettings(tree);

  if (game.modules.get("director")?.active) {
    settingsContent.children.splice(5, 0, {

      id: "s-director",
      name: "Director",
      icon: "twemoji:clapper-board",
      children: [
        {
          id: "s-director-general",
          name: "General",
          icon: "twemoji:clapper-board",
          component: DirectorSettings,
        },

        {
          id: "s-director-effects",
          name: "Effect Editor",
          icon: "material-symbols:magic-button",
          component: EffectEditorSettings,
        }
      ]
    })
  }

  game.settings.registerMenu(moduleId, "configure-settings", {
    name: "",
    label: "Alpha Settings",
    icon: "fas fa-cog",
    type: settings.makeShim(),
    restricted: false
  });
});

const gridTool = {
  name: "alpha-grid-btn",
  title: "Toggle Alpha Grid",
  icon: "ic:twotone-widgets",
  onClick: () => {
    grid.toggle();
  },
  toggle: true,
  isActive: _ => setting("show-grid"),
}

Hooks.on('renderSceneControls', (_) => {
  if (game?.user?.isGM) {
    if (setting(SETTINGS.DEV_FEATURES) && !tools.tools.includes(gridTool)) {
      tools.tools.push(...[
        gridTool,
      ])
    }
  } else {
    tools.tools = []
    if (setting(SETTINGS.DEV_FEATURES)) {
      tools.tools = [
        gridTool
      ]
    }
  }
  if (tools.tools?.length > 0 && !document.querySelector(`[data-control='${tools.name}']`)) {
    addTools(tools);
  }
});

Hooks.once('ready', async () => {
  helperStores()
  initStores();
  grid.start();

  if (game.user.isGM) {
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


    new NotificationsApp().render(true);
    logger.info(`Started! Version: ${game.modules.get("alpha-suit").data.version}`)

    const indexMode = setting(SETTINGS.FILES_INDEX_MODE);
    if (indexMode != "manual" && indexMode != "ondemand") {
      const delay = indexMode == "auto" ? setting(SETTINGS.FILES_INDEX_DELAY) : 0;
      if (delay >= 0) {
        if (delay != 0) {
          notify.info(`Indexing will start in ${delay} seconds.`)
        }
        setTimeout(rebuildIndex, delay * 1000)
      }
    }
  }
}
);
