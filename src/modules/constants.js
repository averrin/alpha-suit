export const moduleId = "alpha-suit";
export const infoColor = "#ff6400";

export const FLAGS = {
}

export const SETTINGS = {
  UI_SCALE: "ui-scale",
  RESOLUTION: "resolution",
  SHOW_TREE_TIP: "show-tree-tip",
  SHOW_HUD: "show-hud",
  COLLAPSED: "collapsed",

  KEY_SHOW: "key-show",
  KEY_COLLAPSE: "key-collapsed",
  TAGS: "tags",

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
