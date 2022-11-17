import { moduleId, SETTINGS } from './constants.js';
import { theme } from "crew-components/stores"
import { setIconCollection } from "crew-components/specs"

export let setting = key => {
  return game.settings.get(moduleId, key);
};

export async function migrateFromString(key) {
  try {
    let current = game.settings.get(moduleId, key);
    if (typeof current === "string" || current instanceof String) {
      current = JSON.parse(current);
      await game.settings.set(moduleId, key, current);
    }
    if (typeof current[0] === "string" || current[0] instanceof String) {
      current = JSON.parse(current[0]);
      if (Array.isArray(current)) {
        await game.settings.set(moduleId, key, current);
      }
    }
  } catch (error) {

  }
}

const debouncedReload = debounce(() => window.location.reload(), 100);
export function initSettings(app) {

  game.settings.register(moduleId, SETTINGS.SHOW_TREE_TIP, {
    scope: "client",
    config: false,
    type: Boolean,
    default: true,
  });

  game.settings.register(moduleId, SETTINGS.SHOW_HUD, {
    scope: "client",
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.register(moduleId, SETTINGS.COLLAPSED, {
    scope: "client",
    config: false,
    type: Boolean,
    default: false,
  });


  game.settings.register(moduleId, SETTINGS.UI_SCALE, {
    name: 'UI scale',
    hint: 'You can use a scroll wheel for fine tuning.',
    config: false,
    type: Number,
    default: 1,
    range: {
      min: 0.1,
      max: 2,
      step: 0.01
    }
  });
  game.settings.register(moduleId, SETTINGS.RESOLUTION, {
    name: "Selected image resolution",
    hint: "Higher is better quality but slower",
    scope: "world",
    config: false,
    range: {
      min: 30,
      max: 600,
      step: 5,
    },
    default: 200,
    type: Number,
    onChange: debouncedReload
  });


  game.settings.register(moduleId, SETTINGS.PAGE_SIZE, {
    name: 'Browser page size',
    hint: "Count of items on browser's paged lists",
    config: false,
    type: Number,
    default: 20,
    onChange: value => {
    },
    range: {
      min: 5,
      max: 50,
      step: 1
    }
  });

  game.settings.register(moduleId, SETTINGS.ADVANCED_MODE, {
    name: 'Browser advanced mode',
    hint: "Shows controls to make filters more flexible",
    config: false,
    type: Boolean,
    default: false,
  });
  game.settings.register(moduleId, SETTINGS.USE_DIRECTOR_TAGS, {
    name: "Use Director's tags",
    hint: "Sync tag colors between modules. Requires the Director module",
    config: false,
    type: Boolean,
    default: false,
    onChange: value => {
      debouncedReload();
    },
  });


  game.settings.register(moduleId, SETTINGS.IGNORED_PACKS, {
    config: false,
    type: Array,
    default: [],
    onChange: value => {
    },
  });

  game.settings.register(moduleId, SETTINGS.TAGS, {
    scope: "world",
    config: false,
    type: Array,
    default: [],
  });

  game.settings.register(moduleId, SETTINGS.FILES_TAGS, {
    scope: "world",
    config: false,
    type: Object,
    default: {},
  });

  game.settings.register(moduleId, SETTINGS.THEME, {
    name: "UI theme",
    hint: "",
    scope: "client",
    config: false,
    choices: {
      'light': "Light",
      'dark': "Dark",
    },
    default: "light",
    type: String,
    onChange: v => theme.set(v)
  });

  game.settings.register(moduleId, SETTINGS.INVERT_CLICKS, {
    name: "Invert clicks in the Tree",
    hint: "Disabled: left-click for select, right for open builtin sheet",
    scope: "client",
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(moduleId, SETTINGS.SHOW_SYSTEM_INFO, {
    name: "Show system-specific widgets in tree items",
    hint: "E.g. Challange rating for DnD5e NPC actors",
    scope: "client",
    config: false,
    default: true,
    type: Boolean,
  });

  game.settings.register(moduleId, SETTINGS.ICON_COLLECTION, {
    name: "Icon collection for tags",
    hint: "Examples: game-icons, mdi, material-symbols, openmoji, fa-solid. More: https://icon-sets.iconify.design",
    scope: "client",
    config: false,
    default: "game-icons",
    type: String,
    onChange: v => setIconCollection(v)
  });

  game.settings.register(moduleId, SETTINGS.SHOW_SPELLS_TAB, {
    name: 'Show "Spells" tab in the Tree',
    hint: "",
    scope: "world",
    config: false,
    default: true,
    type: Boolean,
  });

  game.settings.register(moduleId, SETTINGS.WINDOW_WIDTH_EXPANDED, {
    name: 'Width for expanded windows',
    hint: "This value is used for auto expanding two-pane windows",
    scope: "client",
    config: false,
    default: 1000,
    type: Number,
  });

  game.settings.register(moduleId, SETTINGS.WINDOW_WIDTH_COLLAPSED, {
    name: 'Width for windows in "tree-only" mode',
    hint: "This value is used for auto collapsing two-pane windows",
    scope: "client",
    config: false,
    default: 400,
    type: Number,
  });

  game.settings.register(moduleId, SETTINGS.DEV_FEATURES, {
    name: 'Show WIP features',
    hint: "",
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(moduleId, SETTINGS.FILES_FAV_PATH, {
    name: 'Fav pathes',
    hint: "",
    scope: "world",
    config: false,
    default: [],
    type: Array,
  });


  game.settings.register(moduleId, SETTINGS.FILES_IMAGE_HEIGHT, {
    name: 'File height [Tiles]',
    hint: "File thumb size for the File Manager in the Tiles mode",
    scope: "client",
    config: false,
    default: 64,
    type: Number,
  });

  game.settings.register(moduleId, SETTINGS.FILES_IMAGE_HEIGHT_BIG, {
    name: 'File height [Preview]',
    hint: "File thumb size for the File Manager in the Preview mode",
    scope: "client",
    config: false,
    default: 256,
    type: Number,
  });

  game.settings.register(moduleId, SETTINGS.FILES_DROP_GRID, {
    name: 'Asset grid size',
    hint: "Grid size for dropping files from the File Manager",
    scope: "client",
    config: false,
    default: 100,
    type: Number,
  });

  game.settings.register(moduleId, SETTINGS.FILES_USE_THUMBS, {
    name: 'Use thumbs for images',
    hint: "It should increase performance for big images, but looks clunky for smaller ones",
    scope: "client",
    config: false,
    default: true,
    type: Boolean,
  });

  game.settings.register(moduleId, SETTINGS.FILES_DEPTH_LIMIT, {
    name: 'Indexing depth limit',
    hint: "Decreasing can exclude some files, but improve performance.",
    scope: "world",
    config: false,
    default: 10,
    type: Number,
  });

  game.settings.register(moduleId, SETTINGS.FILES_EXCLUDE_SOURCES, {
    name: 'Excluded storages',
    hint: "E.g. you can exclude 'Data' to prevent 'modules' folders indexing",
    scope: "world",
    config: false,
    default: ["Forge-bazaar"],
    type: Array,
  });

  game.settings.register(moduleId, SETTINGS.FILES_EXCLUDE_FOLDERS, {
    name: 'Excluded folders',
    hint: "Regexp to exclude folders from indexing. E.g. 'icons/svg'",
    scope: "world",
    config: false,
    default: ["node_modules", "src", "modules/_", "scripts/"],
    type: Array,
  });

  game.settings.register(moduleId, SETTINGS.FILES_INDEX_ONLY_ASSETS, {
    name: 'Index only images and videos',
    hint: "More compact index, but slower process and you cannot search for text files",
    scope: "client",
    config: false,
    default: true,
    type: Boolean,
  });

  game.settings.register(moduleId, SETTINGS.FILES_INDEX_COUNT, {
    name: 'Max files in index',
    hint: "The worst way to limit indexing time and memory consumption",
    scope: "client",
    config: false,
    default: 100000,
    type: Number,
  });

  game.settings.register(moduleId, SETTINGS.FILES_SEARCH_LIMIT, {
    name: 'Max files in search',
    hint: "Faster search. Clarify search term to find what you want",
    scope: "client",
    config: false,
    default: 1000,
    type: Number,
  });

  game.settings.register(moduleId, SETTINGS.FILES_INDEX_DELAY, {
    name: 'Delay between foundry ready and indexing start',
    hint: "In seconds. -1 for manual triggering, 0 for no delay",
    scope: "client",
    config: false,
    default: 10,
    type: Number,
  });

  game.settings.register(moduleId, SETTINGS.FILES_SHOW_INDEX_STATUS, {
    name: 'Show indexing status widget',
    hint: "It's annoying if you have a lot of files",
    scope: "client",
    config: false,
    default: true,
    type: Boolean,
  });

  game.settings.register(moduleId, SETTINGS.DND_ENABLE_NATIVE_SHEETS, {
    name: 'Enable Drag and Drop images on native sheets',
    hint: 'You can drop image on the "profile" pic in item/actor sheet to change it',
    scope: "client",
    config: false,
    default: true,
    type: Boolean,
  });

  game.settings.register(moduleId, SETTINGS.DND_ACTOR_MODE, {
    name: "When dropping image on actor, change:",
    hint: "You can change the portrait art, the token, or both.",
    scope: "client",
    config: false,
    choices: {
      'portrait': "Portrait",
      'token': "Token",
      'both': "Both",
    },
    default: "portrait",
    type: String,
  });

  game.settings.register(moduleId, SETTINGS.FILES_DEFAULT_PATH, {
    name: "Default path",
    hint: "This path will be opened every time your start the file manager. Do not forget specify a storage. For example: 'data/modules/jb2a_patreon/Library' instead of 'modules/jb2a_patreon/Library'",
    scope: "client",
    config: false,
    default: "",
    type: String,
  });


  game.settings.register(moduleId, SETTINGS.FILE_CACHE, {
    scope: "world",
    config: false,
    default: [],
    type: Array,
  });
  game.settings.register(moduleId, SETTINGS.FILE_CACHE_STATS, {
    scope: "world",
    config: false,
    default: null,
    type: Object,
  });

  game.settings.register(moduleId, SETTINGS.FILES_INDEX_MODE, {
    name: "File indexing mode",
    hint: "Changing this setting can help if you are don't need fresh file index every launch.",
    scope: "client",
    config: false,
    choices: {
      'auto': "Automatic",
      'persist': "Stored index",
      'manual': "Manual",
    },
    default: "auto",
    type: String,
  });

  game.settings.register(moduleId, SETTINGS.FILES_FUZZY, {
    name: "Fuzzy search",
    hint: "By default file search uses SamrtCase/Regexp matching. But you can switch it to the fuzzy one.",
    scope: "client",
    config: false,
    default: false,
    type: Boolean,
  });
}
