import BrowserSettings from "../view/settings/BrowserSettings.svelte";
import GeneralSettings from "../view/settings/GeneralSettings.svelte";
import TreeSettings from "../view/settings/TreeSettings.svelte";
import HUDSettings from "../view/settings/HUDSettings.svelte";
import SystemSettings from "../view/settings/SystemSettings.svelte";

export const settingsContent = {
  content: [], children: [
    {
      id: "s-alpha-suit",
      name: "General",
      icon: "eva:options-outline",
      component: GeneralSettings,
      content: [], children: [],
    },
    {
      id: "s-alpha-browser",
      name: "Alpha Browser",
      icon: "ph:books-fill",
      component: BrowserSettings,
      content: [], children: [],
    },
    {
      id: "s-alpha-tree",
      name: "Alpha Tree",
      icon: "icon-park-solid:tree-list",
      component: TreeSettings,
      content: [], children: [],
    },
    // {
    //   id: "s-alpha-hud",
    //   name: "Alpha HUD",
    //   icon: "ic:twotone-widgets",
    //   component: HUDSettings,
    //   content: [], children: [],
    // },
    {
      id: "s-alpha-system",
      name: "Game System",
      icon: "fa6-solid:dice-d20",
      component: SystemSettings,
      content: [], children: [],
    },
  ],
};

