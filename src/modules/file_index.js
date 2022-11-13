import { notify } from "../modules/notify.js";
import { breadth, depth } from "treeverse";
import toast from "svelte-french-toast";
import { writable, get } from "svelte/store";
import { setting, logger, capitalize, isVideo, isImage, isSound, formatBytes } from "crew-components/helpers"
import { SETTINGS, moduleId } from "../modules/constants.js";
import IndexStatus from "../view/components/IndexStatus.svelte"
import { isPremium } from "crew-components/premium";

export let fileIndex = writable([]);
export let indexInProcess = writable(false);
export let indexPercents = writable(0);
export let indexPath = writable("");
export let stopFileIndex = writable(false);

export async function saveIndex() {
  const index = get(fileIndex);
  await game.settings.set(moduleId, SETTINGS.FILE_CACHE, index);
  await game.settings.set(moduleId, SETTINGS.FILE_CACHE_STATS, {
    count: index.length,
    size: formatBytes(new Blob(index).size),
  });
}

export async function clearSavedIndex() {
  await game.settings.set(moduleId, SETTINGS.FILE_CACHE, null);
  await game.settings.set(moduleId, SETTINGS.FILE_CACHE_STATS, null)
}

export async function startCache() {
  const mode = setting(SETTINGS.FILES_INDEX_MODE);
  if (mode == "persist") {

    if (isPremium()) {
      const saved = setting(SETTINGS.FILE_CACHE);
      if (saved) {
        fileIndex.set(saved);
        notify.info(`Persistent index loaded: ${saved.length} files`);
        return;
      }
    } else {
      setting(SETTINGS.FILES_INDEX_MODE, "auto");
      clearSavedIndex()
    }

  }

  stopFileIndex.set(false);

  indexPercents.set(0)
  indexInProcess.set(true);

  if (setting(SETTINGS.FILES_SHOW_INDEX_STATUS)) {
    notify.component(IndexStatus, "indexing")
  }

  let storages = [...globalThis.game.data.files.storages];

  if (location.host.includes("forge-vtt")) {
    storages.push("forge-bazaar", "forgevtt");
  }

  console.time("indexing");
  const depthLimit = setting(SETTINGS.FILES_DEPTH_LIMIT);
  let sources = [...storages];
  const excludedSources = setting(SETTINGS.FILES_EXCLUDE_SOURCES);
  const excludedFolders = setting(SETTINGS.FILES_EXCLUDE_FOLDERS);
  sources = sources.filter((s) => !excludedSources.includes(capitalize(s)));
  const index = [];
  let path = ".";
  let picker = FilePicker;
  if (location.host.includes("forge-vtt")) {
    picker = ForgeVTT_FilePicker;
  }

  let indexLimit = setting(SETTINGS.FILES_INDEX_COUNT);
  let firstLevel = [];
  let n = 0;
  for (const source of sources) {
    path = source.startsWith("forge") ? "" : ".";
    await picker.browse(source, path).then((res) => {
      firstLevel.push(...res.dirs);
    });
  }
  for (const source of sources) {
    path = source.startsWith("forge") ? "" : ".";
    // await breadth({
    console.time("indexing " + source);
    await depth({
      tree: path,
      getChildren(node, nodeResult) {
        if (get(stopFileIndex)) return [];
        return picker.browse(source, node).then((res) => {
          if (res.error) return [];
          res.files = res.files.map(p => source + "/" + p);
          if (get(stopFileIndex)) return [];
          if (setting(SETTINGS.FILES_INDEX_ONLY_ASSETS)) {
            index.push(...res.files.filter((f) => isImage(f) || isVideo(f) || isSound(f)));
          } else {
            index.push(...res.files);
          }
          fileIndex.set(index);
          return res.dirs;
        }).catch(_ => []);
      },
      leave(node) {
        if (firstLevel.includes(node)) {
          const per = Math.round((n / firstLevel.length) * 100);
          indexPercents.set(per)
          n++;
        }
        return new Promise((r) => r(node));
      },
      filter(node) {
        if (get(stopFileIndex)) return false;
        if (index.length >= indexLimit) return false;
        const isGood = node.split("/").length < depthLimit && !excludedFolders.some((p) => node.match(new RegExp(p)));
        if (isGood) {
          indexPath.set(`${source}/${node}`);
        } else {
        }
        return isGood;
      },
    });
    // n = 1;
    console.timeEnd("Alpha | Indexing " + source);
  }
  logger.info(`Indexed: ${index.length} files. Depth: ${depthLimit}`);
  console.timeEnd("indexing");
  indexInProcess.set(false);

  indexPercents.set(100)

  indexPath.set(``);

  notify.info(`Indexed: ${index.length} files`)

  setTimeout(_ => toast.dismiss("indexing"), 1000);
  // toast.dismiss("indexing");
}

export function rebuildIndex() {
  if (get(indexInProcess)) return;
  notify.progress(startCache(), {
    loading: "Indexing...",
    success: "Files indexed successfully!",
    error: "Indexing failed.",
  });
}
