import BrowserSettings from "../view/settings/BrowserSettings.svelte";
import GeneralSettings from "../view/settings/GeneralSettings.svelte";
import TreeSettings from "../view/settings/TreeSettings.svelte";
import HUDSettings from "../view/settings/HUDSettings.svelte";
import FilesSettings from "../view/settings/FilesSettings.svelte";
import FilesSearchSettings from "../view/settings/FilesSearchSettings.svelte";
import SystemSettings from "../view/settings/SystemSettings.svelte";
import PremiumSettings from "../view/settings/PremiumSettings.svelte";
import SupportSettings from "../view/settings/SupportSettings.svelte";
import DNDSettings from "../view/settings/DNDSettings.svelte";

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
      // component: FilesSettings,
      content: [], children: [
        {
          id: "s-alpha-files-general",
          name: "General",
          icon: "fa6-solid:gears",
          component: FilesSettings,
        },
        {
          id: "s-alpha-files-search",
          name: "Search",
          icon: "mdi:folder-search",
          component: FilesSearchSettings,
        },
        {
          id: "s-alpha-files-dnd",
          name: "Drag & Drop",
          icon: "ri:drag-drop-line",
          component: DNDSettings,
        },
      ],
    },
    {
      id: "s-alpha-system",
      name: "Game System",
      icon: "fa6-solid:dice-d20",
      component: SystemSettings,
    },

    {
      id: "s-alpha-premium",
      name: "Premium",
      icon: "fa6-solid:crown",
      component: PremiumSettings,
      content: [], children: [],
    },

    {
      id: "s-alpha-patreon",
      name: "Support",
      icon: "fa6-brands:patreon",
      component: SupportSettings,
      content: [], children: [],
    },
  ],
};

