import { moduleId, SETTINGS } from './constants.js';
import { theme } from "./stores.js"
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
    hint: 'If ui are too big or too small for your display. Requires refresh.',
    config: false,
    type: Number,
    default: 1,
    onChange: value => {
      // debouncedReload();
    },
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
    config: true,
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
    config: true,
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
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register(moduleId, SETTINGS.USE_DIRECTOR_TAGS, {
    name: "Use Director's tags",
    hint: "Sync tag colors between modules. Requires the Director module",
    config: true,
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

  game.settings.register(moduleId, SETTINGS.THEME, {
    name: "UI theme",
    hint: "",
    scope: "client",
    config: true,
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
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(moduleId, SETTINGS.SHOW_SYSTEM_INFO, {
    name: "Show system-specific widgets in tree items",
    hint: "E.g. Challange rating for DnD5e NPC actors",
    scope: "client",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(moduleId, SETTINGS.ICON_COLLECTION, {
    name: "Icon collection for tags",
    hint: "Examples: game-icons, mdi, material-symbols, openmoji, fa-solid. More: https://icon-sets.iconify.design",
    scope: "client",
    config: true,
    default: "game-icons",
    type: String,
    onChange: v => setIconCollection(v)
  });

  game.settings.register(moduleId, SETTINGS.SHOW_SPELLS_TAB, {
    name: 'Show "Spells" tab in the Tree',
    hint: "",
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });
}
