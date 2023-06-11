import BrowserSettings from "../view/settings/BrowserSettings.svelte";
import GeneralSettings from "../view/settings/GeneralSettings.svelte";
import TreeSettings from "../view/settings/TreeSettings.svelte";
// import HUDSettings from "../view/settings/HUDSettings.svelte";
import FilesSettings from "../view/settings/FilesSettings.svelte";
import FilesSearchSettings from "../view/settings/FilesSearchSettings.svelte";
import SystemSettings from "../view/settings/SystemSettings.svelte";
import PremiumSettings from "../view/settings/PremiumSettings.svelte";
import SupportSettings from "../view/settings/SupportSettings.svelte";
import DNDSettings from "../view/settings/DNDSettings.svelte";
import GridSettings from "../view/settings/GridSettings.svelte";
import ToolsSettings from "../view/settings/ToolsSettings.svelte"
import DrawSettings from "../view/settings/DrawSettings.svelte"

import DirectorSettings from "../view/settings/DirectorSettings.svelte";
import EffectEditorSettings from "../view/settings/EffectEditorSettings.svelte";

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
      id: "s-alpha-tools",
      name: "Tools",
      icon: "vaadin:tools",
      component: ToolsSettings,
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
      id: "s-alpha-grid",
      name: "Alpha Grid",
      icon: "ic:twotone-widgets",
      component: GridSettings,
    },
    {
      id: "s-alpha-Draw",
      name: "Alpha Draw",
      icon: "mingcute:paint-brush-fill",
      component: DrawSettings,
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

export function initSettingsTopics() {
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
}
