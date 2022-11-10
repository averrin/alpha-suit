import { writable, get } from 'svelte/store';
import { getFlag } from "crew-components/helpers"
import { TreeItem } from "./Tree.js";
import Tag from "crew-components/tags";
import { moduleId, SETTINGS } from "./constants.js";
import { setting } from './settings.js';
import { filterItemPredicate } from "crew-components/helpers";
import { isPremium } from "crew-components/premium";
import { helpContent } from "./help_content.js"
import { settingsContent } from "./settings_content.js"
let tagSource = moduleId;


export const selected = writable([]);
export const selectedBrowser = writable([]);
export const selectedHelp = writable([]);
export const selectedSetting = writable([]);
export const expanded = writable([]);
export const treeItems = writable({});
export const compendiumTree = writable({});
export const filter = writable({});
export const filterCompendium = writable({});
export const filterAdvanced = writable({});
export const currentCollection = writable(null);
export const isDragging = writable(false);
export const aliases = writable({});
export const browserMode = writable(null);
export const helpTopic = writable(null);
export const helpTree = writable({});
export const settingsTopic = writable(null);
export const settingsTree = writable({});

export const tagsStore = writable([]);
export const systems = writable({});
export const system = writable(null);

export const directorActionsStore = writable([]);
export const charactersStore = writable([]);
export const targetsStore = writable([]);

function getTree() {
  let collection = get(currentCollection);
  return collection.directory.tree;
}

export function addSystem(system) {
  systems.update(s => {
    s[system.id] = system;
    return s;
  })
}

async function initCompendiumTreeCF() {
  game.packs.contents.forEach(p => p.type = `${p.metadata.type} (${p.metadata.packageName})`);
  const children = game.customFolders.compendium.folders.contents.filter(f => f.id.startsWith("cfolder"));
  const content = game.customFolders.compendium.folders.get("default")?.content || [];

  const ignored = setting(SETTINGS.IGNORED_PACKS);

  compendiumTree.set(buildTree({ content: content, children }, undefined, (item, source) => {
    source = game.packs.get(source.id) || source;
    item.source = source;
    item.count = source.index?.size;
    item.extraIcons = [];
    item.icon = "fa-solid:atlas";
    if (item.color == "#000000") {
      item.color = undefined;
    }
    if (ignored.includes(source.metadata.label)) {
      item.extraIcons.push("octicon:diff-ignored-16");
    }
    if (source.private) {
      item.extraIcons.push("fa-solid:eye-slash");
    }
    if (source.locked) {
      item.extraIcons.push("fa-solid:lock");
    }
    return item;
  }, (c) => {
    c._icon = "fa-solid:folder"
    if (c.color == "#000000") {
      c.color = undefined;
    }
    return c;
  }));
}

async function initCompendiumTree() {
  if (game.modules.get("compendium-folders")?.active) {
    return initCompendiumTreeCF();
  }
  const ignored = setting(SETTINGS.IGNORED_PACKS);
  let children = [...new Set(game.packs.contents.map(p => p.metadata.type))];
  children = children.map(type => {
    const packs = game.packs.contents.filter(p => p.metadata.type == type);
    return {
      icon: "fa-solid:folder",
      id: type,
      name: type,
      children: [],
      content: packs
    };
  });
  compendiumTree.set(buildTree({ content: [], children }, undefined, (item, source) => {
    item.count = source.index?.size;
    item.icon = "fa-solid:atlas";
    item.type = `${source?.metadata?.type} (${source?.metadata?.package})`;
    item.extraIcons = [];
    if (ignored.includes(source.metadata.label)) {
      item.extraIcons.push("octicon:diff-ignored-16");
    }
    if (source.private) {
      item.extraIcons.push("fa-solid:eye-slash");
    }
    if (source.locked) {
      item.extraIcons.push("fa-solid:lock");
    }
    return item;
  }, f => {
    if (f.color == "#000000") {
      f.color = undefined;
    }
    return f;
  }));
}

function initActorsTree() {
  treeItems.set(buildTree(getTree()));

  Hooks.on("renderSidebarDirectory", () => {
    treeItems.set(buildTree(getTree(), get(filter)));
  });
  Hooks.on("updateActor", () => {
    treeItems.set(buildTree(getTree(), get(filter)));
  });
  Hooks.on("updateItem", () => {
    treeItems.set(buildTree(getTree(), get(filter)));
  });
  filter.subscribe((f) => {
    treeItems.set(buildTree(getTree(), f));
  });
  currentCollection.subscribe(_ => treeItems.set(buildTree(getTree())));
}

export function filterItems(items, filter) {
  if (filter?.filters?.length > 0 || filter?.persist_filters?.length > 0) {

    let filtered = Object.entries(items).map(([_, v]) => { return { ...v } })
      .filter(
        item =>
          item.root
          || item?.source?.depth
          || filterItemPredicate(item.source.data, filter, get(aliases))
      )
    for (let n = 0; n < 5; n++) {
      filtered.forEach(v => {
        v.children = v.children.filter((ch) => filtered.find(item => item.id == ch.id));
      });
      filtered = filtered.filter(
        v => v.root || !(v?.source instanceof Folder || v?.source?.depth) || v.children.length > 0
      );
    }
    if (filtered) {
      items = {};
      filtered.forEach(i => items[i.id] = i);
      setTimeout(() => {
        const folders = filtered.filter(v => v.root || v?.source instanceof Folder || v?.source?.depth);
        expanded.set(Array.from(folders.map(v => v.id)));
      }, 0);
    }

  }
  return items
}

export function buildHelpTree() {
  let items = {};
  addTree(helpContent).forEach(i => items[i.id] = i);
  return items;
}

export function buildSettingsTree() {
  let items = {};
  addTree(settingsContent).forEach(i => items[i.id] = i);
  return items;
}

export function buildTree(tree, filter, transform, folderTransform) {
  let items = {};
  addTree(tree, undefined, transform, folderTransform).forEach(i => items[i.id] = i);
  items = filterItems(items, filter);
  return items;
}

function updateDropHandlers(sheet) {
  if (!setting(SETTINGS.DND_ENABLE_NATIVE_SHEETS)) return;
  const selectors = [".profile", ".profile-img", ".player-image"];
  for (const selector of selectors) {
    sheet.element[0].querySelectorAll(selector).forEach((e) => {
      e.ondrop = (event) => {
        const data = TextEditor.getDragEventData(event);
        if (data.type != "Tile") return;
        if (isPremium() && sheet.actor) {
          const mode = setting(SETTINGS.DND_ACTOR_MODE);
          if (mode == "portrait" || mode == "both") {
            sheet.document.update({ img: data.texture.src });
          }
          if (mode == "token" || mode == "both") {
            sheet.document.update({
              "prototypeToken.texture.src": data.texture.src,
              "token.texture.src": data.texture.src
            });
            sheet.token?.update({
              "texture.src": data.texture.src
            });
          }
        } else {
          sheet.document.update({ img: data.texture.src });
        }
      }
    });
  }
}

export function initStores() {
  let sys = get(systems)[globalThis.game.system.id] || get(systems)["*"];
  if (sys.id == "*") {
    sys.id = globalThis.game.system.id;
  }
  system.set(sys);
  if (sys?.init) {
    sys.init();
  }
  if (globalThis.game.modules.get("director")?.active) {
    tagSource = setting(SETTINGS.USE_DIRECTOR_TAGS) ? "director" : moduleId;
  }

  helpTree.set(buildHelpTree())
  settingsTree.set(buildSettingsTree())

  currentCollection.set(game.actors);
  // aliases.set({ "@onScene": "onScene(@item)" })
  tagsStore.set(game.settings.get(tagSource, SETTINGS.TAGS).map(Tag.fromPlain).filter(a => a));
  tagsStore.subscribe(tags => {
    game.settings.set(tagSource, SETTINGS.TAGS, tags);
  })
  initActorsTree();
  initCompendiumTree();

  Hooks.on("renderCompendiumFolderDirectory", () => {
    initCompendiumTree();
  });

  if (!setting(SETTINGS.DND_ENABLE_NATIVE_SHEETS)) return;
  Hooks.on("renderItemSheet", (sheet) => updateDropHandlers(sheet));
  Hooks.on("renderActorSheet", (sheet) => updateDropHandlers(sheet));
}

export function addTree(tree, parent, transform, folderTransform) {
  let items = [];
  tree = tree.model ?? tree;
  const item = TreeItem.from(tree);
  item.color = tree.color || tree.data?.color || tree.folder?.color;;
  let content = tree.content || tree.contents || tree.documents || [];
  item.count = tree.children?.length + content?.length;
  if (isNaN(item.count)) {
    item.count = content?.length;
  }
  if (parent) {
    parent.children.push({ id: item.id });
  } else {
    item.root = true;
    item.id = "root";
  }
  items.push(item);

  for (let c of tree?.children || []) {
    if (folderTransform) {
      c = folderTransform(c);
    }
    if (c) {
      items.push(...addTree(c, item, transform, folderTransform));
    }
  }

  for (const i of content) {
    let ci = TreeItem.from(i);
    if (transform) {
      ci = transform(ci, i);
    }
    item.children.push({ id: ci.id });
    items.push(ci);
  }
  return items;
}

export function moveItemToFolder(itemId, folderId) {
  const updates = [];
  const dir_updates = [];
  let u;

  const doc = get(currentCollection).get(itemId) || game.folders.get(itemId);
  const folder = game.folders.get(folderId);
  const changes = {
    _id: doc.id,
  };
  if (doc instanceof Folder || doc.depth) {
    u = dir_updates;
    changes["parent"] = folder?.id || folder?.folder?.id || null;
  } else {
    u = updates;
    changes["folder"] = folder?.id || folder?.folder?.id || null;
  }

  u.push(changes);
  Folder.updateDocuments(dir_updates);
  get(currentCollection).documentClass.updateDocuments(updates, { parent: null });
  ui.notifications.info(`${doc.name} was moved to ${folder?.name || "Root"}`);
}
