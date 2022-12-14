import HelpControls from "../view/help/HelpControls.svelte"
import HelpFilters from "../view/help/HelpFilters.svelte"
import HelpTags from "../view/help/HelpTags.svelte"
import HelpBrowserFilters from "../view/help/HelpBrowserFilters.svelte"
import HelpBrowserSettings from "../view/help/HelpBrowserSettings.svelte"
import HelpFilesControls from "../view/help/HelpFilesControls.svelte"
import SupportSettings from "../view/settings/SupportSettings.svelte";
import HelpDND from "../view/help/HelpDND.svelte"

export const helpContent = {
  content: [], children: [
    {
      id: "h-alpha-tree",
      name: "Alpha Tree",
      icon: "icon-park-solid:tree-list",
      content: [
        {
          id: "h-alpha-tree-controls",
          name: "Controls",
          icon: "wpf:cursor",
          component: HelpControls
        },
        {
          id: "h-alpha-tree-filters",
          name: "Filters",
          icon: "dashicons:filter",
          component: HelpFilters
        },
        {
          id: "h-alpha-tree-tags",
          name: "Tags",
          icon: "ci:tag",
          component: HelpTags
        },
      ], children: [],
    },
    {
      id: "h-alpha-browser",
      name: "Alpha Browser",
      icon: "ph:books-fill",
      content: [
        {
          id: "h-alpha-browser-filters",
          name: "Filters",
          icon: "dashicons:filter",
          component: HelpBrowserFilters
        },

        {
          id: "h-alpha-browser-settings",
          name: "Settings",
          icon: "fa6-solid:gears",
          component: HelpBrowserSettings
        },
      ], children: [],
    },

    {
      id: "h-alpha-files",
      name: "Alpha File Manager",
      icon: "fa6-solid:folder",
      content: [
        {
          id: "h-alpha-files-controls",
          name: "Controls",
          icon: "wpf:cursor",
          component: HelpFilesControls,
        },
        {
          id: "h-alpha-files-dnd",
          name: "Drag & Drop",
          icon: "ri:drag-drop-line",
          component: HelpDND,
        },
      ], children: [],
    },

    {
      id: "h-alpha-patreon",
      name: "Support",
      icon: "fa6-brands:patreon",
      component: SupportSettings,
      content: [], children: [],
    },
  ]
};
