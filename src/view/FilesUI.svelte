<svelte:options accessors={true} />

<script>
   import { notify } from "../modules/notify.js";
   import Tags from "crew-components/Tags";
   import TagSettings from "crew-components/TagSettings";
   import TreeItemComponent from "./components/TreeItem.svelte";
   import ArgInput from "crew-components/ArgInput";
   import TwoColUI from "./TwoColUI.svelte";
   // import { filesTopic, filesTree, expanded, selectedFolder } from "../modules/stores.js";
   import { expanded, addTree } from "../modules/stores.js";
   import { onDestroy, tick, setContext, getContext } from "svelte";
   import { capitalize, logger, smartCaseFind, setting, fuzzyFindInList } from "crew-components/helpers";
   import { writable, get } from "svelte/store";
   import TreeModel from "tree-model";
   import IconButton from "crew-components/IconButton";
   import { SETTINGS } from "../modules/constants.js";
   import Tag from "crew-components/tags";
   import Intro from "./components/Intro.svelte";
   import HelpFilesControls from "../view/help/HelpFilesControls.svelte";
   import { fileIndex, indexInProcess, rebuildIndex } from "../modules/file_index.js";
   import SelectedFiles from "./components/SelectedFiles.svelte";
   import { isImage, isSound, isVideo, showFile } from "crew-components/helpers";

   import { isPremium } from "crew-components/premium";
   import FileThumb from "./components/FileThumb.svelte";

   const { application } = getContext("external");
   const position = application.position;
   const { height } = position.stores;

   const indexMode = setting(SETTINGS.FILES_INDEX_MODE);
   if (indexMode == "ondemand" && $fileIndex.length == 0) {
      tick().then(rebuildIndex);
   }

   export let elementRoot;
   let topic;
   let nameFilter = "";
   let mode = "tiles";
   let favs = writable(setting(SETTINGS.FILES_FAV_PATH));
   let useThumbs = setting(SETTINGS.FILES_USE_THUMBS);
   let selectedFiles = writable([]);

   function getPadding() {
      let p = document.getElementById("alpha-files-topbar")?.clientHeight ?? 40;
      if ($favs.length > 0) {
         p += document.getElementById("alpha-files-favbar")?.clientHeight ?? 40;
      }
      if (topic) {
         p += document.getElementById("alpha-files-folderbar")?.clientHeight ?? 40;
      }
      p -= 12;
      return p;
   }
   let paddingTop = getPadding();

   let imageHeightGrid = setting(SETTINGS.FILES_IMAGE_HEIGHT);
   let imageHeight = imageHeightGrid;
   let imageHeightBig = setting(SETTINGS.FILES_IMAGE_HEIGHT_BIG);
   let navHistory = writable([]);
   let navIndex = writable(0);

   function onTagClick(_, tag) {
      const fav = $favs.find((f) => f.text == tag);
      openFolder(fav.data);
   }

   const selectedFolder = writable([]);
   const filesTree = writable(null);
   const filesTopic = writable(null);

   function truncateString(str, n) {
      if (str.length > n) {
         return str.substring(0, n) + "…";
      } else {
         return str;
      }
   }

   function onFileClick(e, file) {
      if (e.button == 2) {
         showFile(file);
      } else if (e.button == 1) {
         navigator.clipboard.writeText(file.id);
         notify.info(`Copied: ${file.id}`);
      } else {
         selectedFiles.update((sf) => {
            return [file];
            if (sf.includes(file)) {
               sf = sf.filter((f) => f != file);
            } else {
               sf.push(file);
            }
            return sf;
         });
      }
   }

   const tree = new TreeModel();
   let storages = [...globalThis.game.data.files.storages];

   if (location.host.includes("forge-vtt")) {
      storages.push("forge-bazaar", "forgevtt");
   }
   let sources = storages.map((id) => {
      return {
         id,
         title: capitalize(id),
         children: [],
         content: [],
         icon: "fa6-solid:folder",
         emptyText: "Loading...",
         expandable: true,
         fetched: false,
      };
   });

   const root = tree.parse({ children: sources, id: "root" });

   export function buildFilesTree() {
      const items = [];
      addTree(root, undefined, undefined, (f) => {
         if ($favs.find((fav) => fav.data == f.id)) {
            f.extraIcons = ["fa-solid:star"];
         } else {
            f.extraIcons = [];
         }
         return f;
      }).forEach((i) => (items[i.id] = i));
      // root.all().forEach((i) => (items[i.model.id] = i.model));
      return items;
   }

   filesTree.set(buildFilesTree());

   function fetchFolder(node) {
      if (!node) return;
      const store = node.id.split("/")[0];
      const options = {};
      let bucket;
      if (store == "s3" && node.id.split("/").length > 1) {
         bucket = node.id.split("/")[1];
         options.bucket = bucket;
      }
      let path = ".";
      let picker = FilePicker;
      if (location.host.includes("forge-vtt")) {
         path = "";
         picker = ForgeVTT_FilePicker;
      }
      if (node.id != store) {
         let rest = node.id.replace(store + "/", "");
         if (bucket) {
            if (node.id.split("/").length == 2) {
               rest = rest.replace(bucket, "");
            } else {
               rest = rest.replace(bucket + "/", "");
            }
         }
         if (store == "s3") {
            path = rest;
         } else {
            path = path + "/" + rest;
         }
      }
      try {
         return picker
            .browse(store, path, options)
            .then((res) => {
               return {
                  dirs: res.dirs.sort().map((id) => {
                     let base = id.split("/");
                     base = base[base.length - 1];
                     return {
                        id: `${node.id}/${base}`,
                        children: [],
                        content: [],
                        title: base,
                        name: base,
                        store: store,
                        icon: "fa6-solid:folder",
                        expandable: true,
                     };
                  }),
                  files: res.files.sort().map((f) => {
                     const p = f.split("/");
                     return { id: f, name: p[p.length - 1], store: store };
                  }),
               };
            })
            .catch((e) => {
               logger.error(e);
               return { dirs: [], files: [] };
            });
      } catch (e) {
         logger.error(e);
         return { dirs: [], files: [] };
      }
   }

   function toggleExpanded(node, force = false) {
      if (!node) return;
      // debugger;
      return new Promise((resolve) => {
         expanded.update((ex) => {
            const isExpanded = ex.some((i) => i == node?.id);
            if (isExpanded && !force) {
               return ex.filter((i) => !i.startsWith(node.id));
            } else {
               tick()
                  .then((_) => fetchFolder(node))
                  .then((new_nodes) => {
                     const parent = root.first((n) => n.model.id == node.id);
                     node.source.dirs = new_nodes.dirs;
                     node.source.files = new_nodes.files;
                     node.source.emptyText = `Files: ${new_nodes.files?.length}`;
                     new_nodes.dirs.forEach((new_node) => {
                        if (parent.first((n) => n.model.id == new_node.id)) return;
                        parent.addChild(tree.parse(new_node));
                     });
                     filesTree.set(buildFilesTree());

                     selectedFolder.update((items) => {
                        items = [node.id];
                        return items;
                     });
                     resolve();
                  });
               if (node) {
                  ex.push(node.id);
               }

               return ex;
            }
         });
      });
   }

   function itemClick(e) {
      const { node, event } = e.detail;
      openFolder(node.id, true, true);
   }

   async function setImageThumb(f) {
      if (!isImage(f.id)) return;
      const el = document.getElementById(`file--${f.id}`);
      if (el) {
         return new Promise((resolve) => {
            const img = new Image();
            img.onload = async function () {
               if (this.height / 2 <= imageHeightBig) {
                  el.style.backgroundImage = `url(${f.id})`;
               } else {
                  try {
                     const thumb = await ImageHelper.createThumbnail(f.id, {
                        height: imageHeightBig,
                        width: imageHeightBig,
                     });
                     el.style.backgroundImage = `url(${thumb.thumb})`;
                  } catch (error) {
                     logger.error(error);
                  }
               }
               resolve();
            };
            img.src = f.id;
         });
      }
   }
   async function setVideoThumb(f) {
      if (!isVideo(f.id)) return;
      const el = document.getElementById(`video--${f.id}`);
      if (el) {
         try {
            const thumb = await game.video.createThumbnail(f.id, { height: imageHeightBig, width: imageHeightBig });
            el.setAttribute("poster", thumb);
         } catch (error) {
            logger.error(error);
         }
      }
   }
   async function setThumbsSync() {
      for (const f of files) {
         await setVideoThumb(f);
         if (useThumbs) {
            await setImageThumb(f);
         }
      }
   }

   function filterFiles() {
      files = topic?.source?.files ?? [];
      dirs = topic?.source?.dirs ?? [];
      if (nameFilter) {
         files = files.filter((p) => smartCaseFind(nameFilter, p.name));
         dirs = dirs.filter((p) => smartCaseFind(nameFilter, p.name));
      }
      setThumbsSync();
   }

   let files = [];
   let dirs = [];
   let isFav = false;
   onDestroy(
      selectedFolder.subscribe((s) => {
         selectedFiles.set([]);
         nameFilter = "";
         filesTopic.set(s[0]);
         topic = $filesTree[s[0]];

         paddingTop = getPadding();
         if (!topic) clearHistory();
         tick().then((_) => {
            height.set(get(height) - 1);
            height.set(get(height) + 1);
         });
         filterFiles();
         isFav = topic && !!$favs.find((f) => f.data == topic.id);
      })
   );

   function clearHistory() {
      navHistory.set([]);
      navIndex.set(0);
   }

   function addToHistory(path) {
      let i = $navIndex;
      let history = $navHistory;
      let strip = i > 0 && i != history.length - 1;
      if (strip) {
         history = history.slice(0, i + 1);
      }
      if ($navHistory[history.length - 1] != path) {
         navHistory.set([...history, path]);
         i = history.length;
         if (i < 0) i = 0;
      }
      navIndex.set(i);
   }

   function openFolder(path, record = true, soft = false) {
      // logger.info("open folder", path, record);
      const storage = path.split("/")[0];
      if (!storages.includes(storage)) {
         logger.error("Storage isnt specified!", path, storages);
         return;
      }

      if (!$filesTree[path]) {
         const chain = path.split("/").map((s, i) =>
            path
               .split("/")
               .slice(0, i + 1)
               .join("/")
         );
         let p;
         for (let link of chain) {
            if (!p) {
               p = openFolder(link, false, true);
            } else {
               p = p.then((_) => openFolder(link, false, true));
            }
         }
      }

      if (record) {
         addToHistory(path);
         selectedFolder.update((items) => {
            items = [path];
            return items;
         });
      }

      return toggleExpanded($filesTree[path], !soft);
   }

   function back() {
      let i = $navIndex - 1;
      navIndex.set(i);
      const path = $navHistory[i];
      openFolder(path, false);
   }
   function forward() {
      let i = $navIndex + 1;
      navIndex.set(i);
      const path = $navHistory[i];
      openFolder(path, false);
   }

   function selectFolder(e, topic, i) {
      e?.preventDefault();
      const path = topic.id
         .split("/")
         .slice(0, i + 1)
         .join("/");

      openFolder(path);

      return false;
   }

   function toggleFav(topic) {
      let _favs = $favs;
      if (!isFav) {
         const fav = new Tag(topic.name);
         fav.data = topic.id;
         _favs.push(fav);
      } else {
         _favs = _favs.filter((f) => f.data != topic.id);
      }
      favs.set(_favs);
      isFav = !isFav;
   }

   onDestroy(
      favs.subscribe((_favs) => {
         setting(SETTINGS.FILES_FAV_PATH, _favs);
      })
   );

   let editTag;
   function tagRClick(e, tag) {
      editTag = $favs.find((t) => t.text == tag);
      if (!editTag) {
         editTag = new Tag(tag);
      }
   }

   setContext("tagRClick", tagRClick);

   setContext("tagsStore", favs);

   // async function openMMM() {
   //    const session = new M3Session();
   //    await session.startSession({ configureDialog: false });
   //    session.openWorkshop(new FilePicker());
   // }

   let search = "";
   let searchStatus = "";
   const ff = foundry.utils.debounce(filterFiles, 5);
   const searchLimit = setting(SETTINGS.FILES_SEARCH_LIMIT);
   const fuzzy = setting(SETTINGS.FILES_FUZZY) && isPremium();
   function searchFile() {
      if (search.length >= 3) {
         selectedFiles.set([]);
         searchStatus = "Searching...";
         files = [];
         topic = { id: "Search", source: { files } };
         filterFiles();
         if (!fuzzy) {
            $fileIndex.forEach((f) => {
               const name = f.split("/")[f.split("/").length - 1];
               const store = f.split("/")[0];
               f = f.replace(store + "/", "");
               if (topic.source.files.length >= searchLimit) return;
               if (smartCaseFind(search, name)) {
                  topic.source.files.push({ id: f, name, store });
                  ff();
               }
            });
         } else {
            const result = fuzzyFindInList(
               search,
               $fileIndex.map((f) => {
                  const name = f.split("/")[f.split("/").length - 1];
                  const store = f.split("/")[0];
                  f = f.replace(store + "/", "");
                  return { name, store, id: f };
               }),
               ["name"]
            );
            topic.source.files.push(...result.slice(0, searchLimit).map((r) => r.item));
            filterFiles();
         }
         let fileTags = setting(SETTINGS.FILES_TAGS);
         for (let [f, t] of Object.entries(fileTags)) {
            if (t?.includes(search)) {
               const name = f.split("/")[f.split("/").length - 1];
               const store = f.split("/")[0];
               f = f.replace(store + "/", "");
               topic.source.files.push({ id: f, name, store });
               ff();
            }
         }
         // });

         searchStatus = `Found ${topic.source.files.length} files.`;
      } else {
         topic = null;
      }
   }

   function togglePreviews() {
      useThumbs = !useThumbs;
      setting(SETTINGS.FILES_USE_THUMBS, useThumbs);
      openFolder(topic.id);
   }

   function openFileFolder(e) {
      const file = e.detail;
      openFolder(file.store + "/" + file.id.replace("/" + file.name, ""));
   }

   tick().then((_) => {
      if (isPremium()) {
         const dp = setting(SETTINGS.FILES_DEFAULT_PATH);
         if (dp != "") {
            openFolder(dp);
         }
      }
   });
</script>

<TwoColUI bind:elementRoot id="files" {paddingTop}>
   <svelte:fragment slot="top">
      <TagSettings {editTag} />
      <div id="alpha-files-favbar" class="ui-flex ui-flex-row ui-gap-1 ui-items-center ui-p-1 ui-bg-base-200">
         <!-- <IconButton loading={$indexInProcess} icon="octicon:cache-16" size="xs" on:click={rebuildIndex} /> -->
         <ArgInput
            label="Search"
            type="string"
            bind:value={search}
            disabled={$fileIndex.length == 0 || $indexInProcess}
            size="xs"
            width="18rem"
            on:change={foundry.utils.debounce(searchFile, 500)}
            clearable={true}
         >
            <svelte:fragment slot="right">
               {#if $fileIndex.length == 0}
                  <IconButton icon="mdi:database" on:click={rebuildIndex} type="primary" title="Start indexing" />
               {/if}
            </svelte:fragment>
         </ArgInput>

         <div class="ui-flex ui-flex-1 ui-w-full">
            <Tags {onTagClick} tags={$favs.map((f) => f.text)} disable={true} />
         </div>
         <div class="ui-flex-none ui-group-xs">
            <!-- {#if M3Session} -->
            <!--    <IconButton icon="fa-solid:paint-brush" title="Browse from Melvin's Workshop" on:click={openMMM} /> -->
            <!-- {/if} -->
            <IconButton icon="clarity:help-solid" on:click={AlphaSuit.showHelp} />
         </div>
      </div>

      {#if topic}
         <div
            id="alpha-files-topbar"
            class="ui-flex ui-flex-row ui-gap-1 ui-items-center ui-p-2 ui-bg-base-200"
            class:ui-pt-0={$favs.length != 0}
         >
            <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-w-full ui-items-center">
               <div class="ui-btn-group ui-btn-group-md">
                  <IconButton title="Back" icon="fa-solid:arrow-left" on:click={back} disabled={$navIndex == 0} />
                  <IconButton
                     title="Forward"
                     icon="fa-solid:arrow-right"
                     on:click={forward}
                     disabled={$navIndex >= $navHistory.length - 1}
                  />
               </div>
               <div class="ui-divider ui-divider-horizontal ui-m-0" />

               {#each topic.id.split("/") as segment, i}
                  <span class="ui-flex ui-flex-row ui-items-center ui-gap-1">
                     {#if segment != "Search"}
                        {#if i > 0}
                           <iconify-icon icon="fa6-solid:folder" />
                           <a class="ui-link" on:click={(e) => selectFolder(e, topic, i)}
                              >{truncateString(segment, 25)}</a
                           >
                        {:else}
                           <iconify-icon icon="bi:server" />
                           <a class="ui-link" on:click={(e) => selectFolder(e, topic, i)}>{capitalize(segment)}</a>
                        {/if}
                     {:else}
                        <iconify-icon icon="mdi:folder-search" />
                        {segment}
                     {/if}
                  </span>
                  <!-- <iconify-icon icon="mdi:slash-forward" /> -->
                  {#if topic.id.split("/").length - 1 != i}
                     /
                  {/if}
               {/each}
            </div>
            <div class="ui-flex-none ui-flex ui-flex-row ui-items-center ui-gap-1">
               <div class="ui-mr-2">
                  {#if topic.id != "Search"}
                     <IconButton
                        size="xs"
                        type="primary"
                        icon={!isFav ? "fa-regular:star" : "fa-solid:star"}
                        title="Toggle favorite"
                        on:click={(_) => toggleFav(topic)}
                     />
                  {/if}
               </div>

               <iconify-icon icon="fa6-solid:folder" />
               {topic.source.dirs?.length ?? 0}
               /
               <iconify-icon icon="fa6-solid:file" />
               {files.length ?? 0}
            </div>
         </div>
      {/if}
   </svelte:fragment>

   <div slot="left" class="ui-flex ui-flex-col ui-gap-2 ui-p-1">
      <TreeItemComponent
         node={Object.values($filesTree).find((i) => i.root)}
         bind:nodes={$filesTree}
         isRoot={true}
         showTags={false}
         disableReorder={true}
         on:click={itemClick}
         on:select={itemClick}
         selected={selectedFolder}
      />
   </div>
   <div slot="right">
      {#if topic}
         <div class="ui-flex ui-flex-col ui-gap-3">
            <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-wrap">
               {#if !topic?.source?.dirs && files.length == 0 && search.length >= 3}
                  <div class="ui-p-3 ui-text-center ui-w-full ui-text-lg">{searchStatus}</div>
               {/if}

               {#if topic?.source?.dirs}
                  {#each dirs as dir (dir.id)}
                     <div
                        class="ui-rounded-md ui-cursor-pointer ui-flex ui-flex-row ui-gap-1 ui-items-center ui-p-2"
                        style:background-color="hsl(var(--b2))"
                        on:click={(e) => selectFolder(e, dir, 999)}
                     >
                        <iconify-icon icon="fa6-solid:folder" />
                        <span>{dir.name}</span>
                     </div>
                  {/each}
                  <div class="break" />
               {/if}
               {#if topic?.source?.files}
                  {#each files as file, i (file.id)}
                     <FileThumb
                        on:click={(e) => onFileClick(e.detail.e, e.detail.file)}
                        {useThumbs}
                        {imageHeight}
                        {file}
                        {mode}
                        selected={$selectedFiles.find((f) => f.id == file.id)}
                     />
                  {/each}
               {/if}
            </div>
         </div>
      {:else}
         <h1>Welcome to the File Manager</h1>
         <p>Please select a folder from the left sidebar.</p>
         <HelpFilesControls />

         <Intro />
      {/if}
   </div>
   <svelte:fragment slot="right-bottom">
      {#if topic}
         <div
            class="ui-flex ui-flex-row ui-gap-2 ui-flex-wrap ui-p-2"
            style:background-color="hsl(var(--b2))"
            id="alpha-files-folderbar"
         >
            <div class="ui-flex ui-flex-col ui-gap-2 ui-flex-1 ui-w-full ui-items-center">
               <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-w-full ui-items-center">
                  <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-w-full ui-items-center">
                     <ArgInput
                        label="Filter"
                        type="string"
                        bind:value={nameFilter}
                        size="xs"
                        width="16rem"
                        on:change={filterFiles}
                        clearable={true}
                     />
                     <ArgInput label="Size" type="int" bind:value={imageHeight} size="xs" width="8rem" />
                  </div>
                  <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-none ui-items-center">
                     <IconButton
                        icon="ic:baseline-preview"
                        size="xs"
                        on:click={togglePreviews}
                        type={useThumbs ? "primary" : "outline"}
                        title="Toggle resized thumbs. Enabled: good for big files. Disabled: good for small files."
                     />

                     <div class="ui-btn-group ui-btn-group-xs">
                        <IconButton
                           title="List view"
                           icon="fa6-solid:list"
                           type={mode == "list" ? "primary" : "outline"}
                           on:click={(_) => {
                              mode = "list";
                              imageHeight = imageHeightGrid;
                           }}
                        />
                        <IconButton
                           icon="bi:grid-3x2-gap-fill"
                           type={mode == "tiles" ? "primary" : "outline"}
                           title="Tiles view"
                           on:click={(_) => {
                              mode = "tiles";
                              imageHeight = imageHeightGrid;
                           }}
                        />
                        <IconButton
                           title="Previews view"
                           icon="bxs:image"
                           type={mode == "big" ? "primary" : "outline"}
                           on:click={(_) => {
                              mode = "big";
                              imageHeight = imageHeightBig;
                           }}
                        />
                     </div>
                  </div>
               </div>
               {#if $selectedFiles.length > 0}
                  <SelectedFiles
                     on:openFileFolder={openFileFolder}
                     selectedFiles={$selectedFiles}
                     isSearch={topic.id == "Search"}
                  />
               {/if}
            </div>
         </div>
      {/if}
   </svelte:fragment>
</TwoColUI>

<style>
   .break {
      flex-basis: 100%;
      height: 0;
   }

   :global(.alpha-file-tooltip) {
      font-size: 1.2rem;
   }
</style>
