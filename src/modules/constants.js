export const moduleId = "alpha-suit";
export const infoColor = "#ff6400";

export const FLAGS = {
}

export const SETTINGS = {
  SHOW_BROWSER: "show-browser",
  UI_SCALE: "ui-scale",
  RESOLUTION: "resolution",
  SHOW_TREE: "show-tree",
  SHOW_TREE_TIP: "show-tree-tip",
  SHOW_HELP: "show-help",
  COLLAPSED: "collapsed",

  KEY_SHOW: "key-show",
  KEY_COLLAPSE: "key-collapsed",
  TAGS: "tags",

  PAGE_SIZE: "browser-page-size",
  IGNORED_PACKS: "ignored-packs",
  ADVANCED_MODE: "advanced-mode",
  USE_DIRECTOR_TAGS: "use-director-tags",
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
