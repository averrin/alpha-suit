export const moduleId = "alpha-suit";
export const infoColor = "#ff6400";

export const FLAGS = {
}

export const SETTINGS = {
  KEY_TOGGLE_TREE: "key-toggle-tree",
  KEY_TOGGLE_GRID: "key-toggle-grid",
  KEY_TOGGLE_DRAW: "key-toggle-draw",

  DRAW_SHOW_CP: "draw-show-cp",
  DRAW_MARKERS: "draw-markers",

  TOOLS_TREE: "tools-tree",
  TOOLS_BROWSER: "tools-browser",
  TOOLS_FILES: "tools-files",
  TOOLS_SETTINGS: "tools-settings",
  TOOLS_HELP: "tools-help",
  TOOLS_GRID: "tools-grid",
  TOOLS_CREATOR: "tools-creator",

  HIDE_TRIAL_2023: "hide-trial-2023",
  GRID_IN_SIDEBAR: "grid-in-sidebar",
  GRID_IN_TREE: "grid-in-tree",
  GRID_FOR_PLAYERS: "grid-for-players",
  DEBUG: "debug",
  FILES_WHITE_LIST: "files-white-list",
  GRID_LAYOUT: "grid-layout",
  FILES_FUZZY: "files-fuzzy",
  FILES_INDEX_MODE: "files-index-mode",
  FILE_CACHE: "file-cache",
  FILE_CACHE_STATS: "file-cache-stats",
  DND_ACTOR_MODE: "dnd-actor-mode",
  FILES_DEFAULT_PATH: "files-default-path",

  UI_SCALE: "ui-scale",
  RESOLUTION: "resolution",
  SHOW_TREE_TIP: "show-tree-tip",
  SHOW_HUD: "show-hud",
  COLLAPSED: "collapsed",

  KEY_SHOW: "key-show",
  KEY_COLLAPSE: "key-collapsed",
  TAGS: "tags",
  FILES_TAGS: "files-tags",

  PAGE_SIZE: "browser-page-size",
  IGNORED_PACKS: "ignored-packs",
  ADVANCED_MODE: "advanced-mode",
  USE_DIRECTOR_TAGS: "use-director-tags",
  THEME: "theme",
  INVERT_CLICKS: "invert-clicks",
  SHOW_SYSTEM_INFO: "show-system-info",
  ICON_COLLECTION: "icon-collection",
  SHOW_SPELLS_TAB: "show-spells-tab",
  WINDOW_WIDTH_EXPANDED: "win-width-expanded",
  WINDOW_WIDTH_COLLAPSED: "win-width-collapsed",
  DEV_FEATURES: "dev-features",
  FILES_FAV_PATH: "files-fav-path",
  FILES_IMAGE_HEIGHT: "files-height",
  FILES_IMAGE_HEIGHT_BIG: "files-height-big",
  FILES_DROP_GRID: "files-grid-size",
  FILES_USE_THUMBS: "files-use-thumbs",

  FILES_DISABLE_SEARCH: "files-disable-search",
  FILES_DEPTH_LIMIT: "files-depth-limit",
  FILES_EXCLUDE_SOURCES: "files-exclude-sources",
  FILES_EXCLUDE_FOLDERS: "files-exclude-folders",
  FILES_INDEX_ONLY_ASSETS: "files-index-only-assets",
  FILES_INDEX_COUNT: "files-index-count",
  FILES_SEARCH_LIMIT: "files-search-limit",
  FILES_INDEX_DELAY: "files-indes-delay",
  FILES_SHOW_INDEX_STATUS: "files-show-index-status",
  DND_ENABLE_NATIVE_SHEETS: "dnd-enable-native-sheets",
};

export const HOOKS = [
  'controlToken',
  'updateToken',
  'updateActor',
  'targetToken',

  'canvasReady',
  'createToken',
  'deleteToken',
  'deleteActor',
  // 'renderTokenActionHUD',
];
