import { writable, get } from 'svelte/store';
import { getFlag } from "crew-components/helpers"
import { TreeItem } from "./Tree.js";
import Tag from "crew-components/tags";
import { moduleId, SETTINGS } from "./constants.js";
import { setting } from './settings.js';
import { filterItemPredicate } from "crew-components/helpers";
let tagSource = moduleId;

export const selected = writable([]);
export const selectedBrowser = writable([]);
export const expanded = writable([]);
export const treeItems = writable({});
export const compendiumTree = writable({});
export const filter = writable({});
export const filterCompendium = writable({});
export const filterAdvanced = writable({});
export const currentCollection = writable(null);
export const isDragging = writable(false);

export const tagsStore = writable([]);
export const systems = writable({});
export const system = writable(null);

function getTree() {
  let collection = get(currentCollection);
  return collection.directory.tree;
}

async function initCompendiumTreeCF() {
  game.packs.contents.forEach(p => p.type = `${p.metadata.type} (${p.metadata.package})`);
  const children = game.customFolders.compendium.folders.contents.filter(f => f.id.startsWith("cfolder"));
  const content = game.customFolders.compendium.folders.get("default")?.content || [];

  children.forEach(p => p.icon = "fa-solid:folder");
  const ignored = setting(SETTINGS.IGNORED_PACKS);

  compendiumTree.set(buildTree({ content: content, children }, undefined, (item, source) => {
    source = game.packs.get(source.id);
    item.source = source;
    item.count = source.index?.size;
    item.extraIcons = [];
    item.icon = "fa-solid:atlas";
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
    packs.forEach(p => p.icon = "fa-solid:atlas");
    packs.forEach(p => p.type = `${type} (${p.metadata.package})`);
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
  filter.subscribe((f) => {
    treeItems.set(buildTree(getTree(), f));
  });
  currentCollection.subscribe(_ => treeItems.set(buildTree(getTree())));
}

export function filterItems(items, filter) {
  if (filter?.filters?.length > 0) {

    let filtered = Object.entries(items).map(([_, v]) => { return { ...v } })
      .filter(
        item =>
          item.root
          || item?.source?.depth
          || filterItemPredicate(item.source.data, filter, {})
      )
    for (let n = 0; n < 5; n++) {
      filtered.forEach(v => {
        v.children = v.children.filter((ch) => filtered.find(item => item.id == ch.id));
      });
      filtered = filtered.filter(
        v => v.root || !(v?.source instanceof Folder) || v.children.length > 0
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

export function buildTree(tree, filter, transform, folderTransform) {
  let items = {};
  addTree(tree, undefined, transform, folderTransform).forEach(i => items[i.id] = i);
  items = filterItems(items, filter);
  return items;
}

export function initStores() {
  let sys = get(systems)[globalThis.game.system.id] || get(systems)["*"];
  if (sys.id == "*") {
    sys.id = globalThis.game.system.id;
  }
  system.set(sys);
  if (globalThis.game.modules.get("director")?.active) {
    tagSource = setting(SETTINGS.USE_DIRECTOR_TAGS) ? "director" : moduleId;
  }

  currentCollection.set(game.actors);
  tagsStore.set(game.settings.get(tagSource, SETTINGS.TAGS).map(Tag.fromPlain).filter(a => a));
  tagsStore.subscribe(tags => {
    game.settings.set(tagSource, SETTINGS.TAGS, tags);
  })
  initActorsTree();
  initCompendiumTree();

  Hooks.on("renderCompendiumFolderDirectory", () => {
    initCompendiumTree();
  });
}

export function addTree(tree, parent, transform, folderTransform) {
  let items = [];
  const item = TreeItem.from(tree);
  item.color = tree.color || tree.data?.color || tree.folder?.color;;
  let content = tree.content || tree.contents || tree.documents || [];
  item.count = tree.children?.length + content?.length;
  if (parent) {
    parent.children.push({ id: item.id });
  } else {
    item.root = true;
    item.id = "root";
  }
  items.push(item);

  for (let c of tree?.children) {
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
