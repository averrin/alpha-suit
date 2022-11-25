import { addTools, setting } from "crew-components/helpers"
import { getApp } from "./apps";
import {SETTINGS} from "./modules/constants.js"

const specs = {
  name: "alpha-suit",
  title: "Alpha Suit",
  icon: "mdi:alpha",

  tools: [
    {
      name: "alpha-tree-btn",
      title: "Toggle Tree",
      icon: "icon-park-solid:tree-list",
      onClick: () => {
        getApp("tree").toggle();
      },
      toggle: true,
      isActive: _ => setting("show-tree"),
      isGM: true,
    },
    {
      name: "alpha-browser-btn",
      title: "Toggle Browser",
      icon: "ph:books-fill",
      onClick: async () => {
        await getApp("browser").toggle();
      },
      toggle: true,
      isActive: _ => setting("show-browser"),
      isGM: true,
    },

    {
      name: "alpha-files",
      title: "Alpha File Manager",
      icon: "fa6-solid:folder",
      onClick: () => {
        getApp("files").toggle();
      },
      toggle: true,
      isActive: _ => setting("show-files"),
      isGM: true,
    },
    {
      name: "alpha-settings",
      title: "Settings",
      icon: "fa6-solid:gears",
      onClick: () => {
        getApp("settings").toggle();
      },
      toggle: true,
      isActive: _ => setting("show-settings"),
      isGM: true,
    },
    {
      name: "alpha-help-btn",
      title: "Toggle Help Center",
      icon: "clarity:help-solid",
      onClick: () => {
        getApp("help").toggle();
      },
      toggle: true,
      isActive: _ => setting("show-help"),
      isGM: true,
    },
    {
      name: "alpha-grid-btn",
      title: "Toggle Alpha Grid",
      icon: "ic:twotone-widgets",
      onClick: () => {
        getApp("grid").toggle();
      },
      toggle: true,
      isActive: _ => setting("show-grid"),
      isGM: false,
      isDev: false,
    }

  ]
}
export function getTool(id) {
  return specs.tools.find(t => t.name == id);
}

export function addTool(spec) {
  specs.tools.push(spec)
}

export function initTools() {
  const dev = setting(SETTINGS.DEV_FEATURES);
  specs.tools = specs.tools.filter(t => {
    if (!game.user.isGM) {
      return !t.isGM;
    }
    return true;
  }).filter(t => {
    if (!dev) {
      return !t.isDev;
    }
    return true
  });

  if (specs.tools?.length > 0 && !document.querySelector(`[data-control='${specs.name}']`)) {
    addTools(specs);
  }
}
