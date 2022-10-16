import BrowserSettings from "../view/settings/BrowserSettings.svelte";
import GeneralSettings from "../view/settings/GeneralSettings.svelte";
import TreeSettings from "../view/settings/TreeSettings.svelte";
import HUDSettings from "../view/settings/HUDSettings.svelte";
import FilesSettings from "../view/settings/FilesSettings.svelte";
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
    {
      id: "s-alpha-files",
      name: "Alpha File Manager",
      icon: "fa6-solid:folder",
      component: FilesSettings,
      content: [], children: [],
    },
    {
      id: "s-alpha-system",
      name: "Game System",
      icon: "fa6-solid:dice-d20",
      component: SystemSettings,
      content: [], children: [],
    },
  ],
};

