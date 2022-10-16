<svelte:options accessors={true} />

<script>
   import Tags from "crew-components/Tags";
   import TagSettings from "crew-components/TagSettings";
   import TreeItemComponent from "./components/TreeItem.svelte";
   import ArgInput from "crew-components/ArgInput";
   import TwoColUI from "./TwoColUI.svelte";
   // import { filesTopic, filesTree, expanded, selectedFolder } from "../modules/stores.js";
   import { expanded, addTree } from "../modules/stores.js";
   import { onDestroy, tick, setContext, getContext } from "svelte";
   import { capitalize, logger, smartCaseFind } from "crew-components/helpers";
   import { writable, get } from "svelte/store";
   import LeftPane from "./components/LeftPane.svelte";
   import { TreeItem } from "../modules/Tree.js";
   import TreeModel from "tree-model";
   import IconButton from "crew-components/IconButton";
   import InlineButton from "crew-components/InlineButton";
   import CopyButton from "crew-components/CopyButton";
   import { setting } from "crew-components/helpers";
   import { SETTINGS } from "../modules/constants.js";
   import Tag from "crew-components/tags";
   import Intro from "./components/Intro.svelte";
   import HelpFilesControls from "../view/help/HelpFilesControls.svelte";

   const { application } = getContext("external");
   const position = application.position;
   const { height } = position.stores;

   export let elementRoot;
   const imgExt = new FilePicker()._getExtensions("image");
   let topic;
   let nameFilter = "";
   let mode = "tiles";
   let favs = writable(setting(SETTINGS.FILES_FAV_PATH));

   function getPadding() {
      let p = 40;
      if ($favs.length > 0) {
         p += 40;
      }
      if (topic) {
         p += 40;
      }
      return p;
   }
   let paddingTop = getPadding();

   let imageHeightGrid = setting(SETTINGS.FILES_IMAGE_HEIGHT);
   let imageHeight = imageHeightGrid;
   let imageHeightBig = setting(SETTINGS.FILES_IMAGE_HEIGHT_BIG);
   let navHistory = writable([]);
   let navIndex = writable(0);

   function findPoster(file) {
      return "icons/svg/video.svg";
   }

   function isImage(path) {
      const ext = "." + path.split(".")[path.split(".").length - 1];
      return imgExt.includes(ext);
   }
   function isVideo(path) {
      return VideoHelper.hasVideoExtension(path);
   }

   function onTagClick(_, tag) {
      const fav = $favs.find((f) => f.text == tag);
      // logger.info(fav);
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

   function showFile(file) {
      if (isImage(file.name)) {
         new ImagePopout(file.id, { title: file.name }).render(true);
      }
   }

   function onFileClick(e, file) {
      if (e.button == 2) {
         showFile(file);
      } else if (e.button == 1) {
         navigator.clipboard.writeText(file.id);
         ui.notifications.info(`Copied: ${file.id}`);
      } else {
      }
   }

   function onDragStart(event, file) {
      const dragData = {
         type: "Tile",
         texture: { src: file.id },
         tileSize: setting(SETTINGS.FILES_DROP_GRID),
      };
      event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
   }

   const tree = new TreeModel();
   let storages = globalThis.game.data.files.storages;

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
      let path = ".";
      let picker = FilePicker;
      if (location.host.includes("forge-vtt")) {
         path = "";
         picker = ForgeVTT_FilePicker;
      }
      if (node.id != store) {
         path = path + "/" + node.id.replace(store + "/", "");
      }
      return picker.browse(store, path).then((res) => {
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
                  icon: "fa6-solid:folder",
                  expandable: true,
               };
            }),
            files: res.files.sort().map((f) => {
               const p = f.split("/");
               return { id: f, name: p[p.length - 1] };
            }),
         };
      });
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
      const thumb = await ImageHelper.createThumbnail(f.id, { height: imageHeightBig, width: imageHeightBig });
      document.getElementById(`file--${f.id}`).style.backgroundImage = `url(${thumb.thumb})`;
   }
   async function setVideoThumb(f) {
      if (!isVideo(f.id)) return;
      const thumb = await game.video.createThumbnail(f.id, { height: imageHeightBig, width: imageHeightBig });
      document.getElementById(`video--${f.id}`).setAttribute("poster", thumb);
   }
   async function setThumbsSync() {
      for (const f of files) {
         await setVideoThumb(f);
         await setImageThumb(f);
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
      logger.info("open folder", path, record);
      if (!$filesTree[path]) {
         // logger.error("path isnt loaded yet", path);
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

      // tick().then((_) => {
      //    logger.info($navHistory, $navIndex);
      // });
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
</script>

<TwoColUI bind:elementRoot id="files" {paddingTop}>
   <svelte:fragment slot="top">
      <TagSettings {editTag} />
      {#if $favs.length > 0}
         <div id="alpha-files-favbar" class="ui-flex ui-flex-row ui-gap-1 ui-items-center ui-p-1 ui-bg-base-300">
            <div class="ui-flex ui-flex-1 ui-w-full">
               <Tags {onTagClick} tags={$favs.map((f) => f.text)} disable={true} />
            </div>
            <div class="ui-flex-none ui-group-xs">
               <!-- {#if M3Session} -->
               <!--    <IconButton icon="fa-solid:paint-brush" title="Browse from Melvin's Workshop" on:click={openMMM} /> -->
               <!-- {/if} -->
            </div>
         </div>
      {/if}

      {#if topic}
         <div
            id="alpha-files-topbar"
            class="ui-flex ui-flex-row ui-gap-1 ui-items-center ui-p-2 ui-bg-base-300"
            class:ui-pt-0={$favs.length != 0}
         >
            <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-w-full ui-items-center">
               <div class="ui-btn-group ui-btn-group-md">
                  <IconButton icon="fa-solid:arrow-left" on:click={back} disabled={$navIndex == 0} />
                  <IconButton
                     icon="fa-solid:arrow-right"
                     on:click={forward}
                     disabled={$navIndex >= $navHistory.length - 1}
                  />
               </div>
               <div class="ui-divider ui-divider-horizontal ui-m-0" />

               {#each topic.id.split("/") as segment, i}
                  <span class="ui-flex ui-flex-row ui-items-center ui-gap-1">
                     {#if i > 0}
                        <iconify-icon icon="fa6-solid:folder" />
                        <a class="ui-link" on:click={(e) => selectFolder(e, topic, i)}>{truncateString(segment, 25)}</a>
                     {:else}
                        <iconify-icon icon="bi:server" />
                        <a class="ui-link" on:click={(e) => selectFolder(e, topic, i)}>{capitalize(segment)}</a>
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
                  <IconButton
                     size="xs"
                     type="primary"
                     icon={!isFav ? "fa-regular:star" : "fa-solid:star"}
                     title="Toggle favorite"
                     on:click={(_) => toggleFav(topic)}
                  />
               </div>

               <iconify-icon icon="fa6-solid:folder" />
               {topic.source.dirs?.length ?? 0}
               /
               <iconify-icon icon="fa6-solid:file" />
               {topic.source.files?.length ?? 0}
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
                  {#each files as file (file.id)}
                     <div
                        id={`file--${file.id}`}
                        class="ui-rounded-md ui-cursor-pointer ui-bg-base-300 ui-flex ui-flex-row ui-items-center ui-p-2"
                        class:zoom-container={mode == "tiles" && (isImage(file.id) || isVideo(file.id))}
                        style:height={`${imageHeight}px`}
                        style:min-width={mode == "big" ? `100%` : `${imageHeight}px`}
                        style:background-image={isImage(file.id)
                           ? `url(modules/alpha-suit/assets/question.svg)`
                           : "unset"}
                        alt={file.name}
                        title={file.name}
                        style="background-size: contain; background-repeat: no-repeat;"
                        on:mouseup={(e) => onFileClick(e, file)}
                        draggable="true"
                        on:dragstart={(e) => onDragStart(e, file)}
                        class:ui-w-full={mode == "list"}
                        style:background-position={mode == "list" ? "left" : "center"}
                        class:file-video={mode != "list" && isVideo(file.name)}
                     >
                        {#if isVideo(file.name)}
                           <video
                              id={`video--${file.id}`}
                              class="ui-rounded-md"
                              class:file-video={mode == "list"}
                              poster={findPoster(file.id)}
                              preload="none"
                              disablePictureInPicture
                              style="height: 100%;"
                              style:width={mode != "list" ? "100%" : "unset"}
                              loop
                              on:mouseover={(e) => {
                                 e.target.play();
                              }}
                              on:mouseout={(e) => {
                                 e.target.pause();
                                 e.target.currentTime = 0;
                              }}
                           >
                              <source src={file.id} type="video/webm" />
                           </video>
                           <!-- <iconify-icon class="seq-icon" icon="fa6-solid:database" title="Sequencer" /> -->
                           {#if Sequencer && Sequencer.Database.inverseFlattenedEntries?.get(file.id)}
                              <CopyButton
                                 size="xs"
                                 icon="fa6-solid:database"
                                 title={"Copy Sequencer path: " +
                                    Sequencer.Database.inverseFlattenedEntries.get(file.id)}
                                 text={Sequencer.Database.inverseFlattenedEntries.get(file.id)}
                                 notification={"Copy Sequencer path: " +
                                    Sequencer.Database.inverseFlattenedEntries.get(file.id)}
                              />
                           {/if}
                        {/if}

                        {#if (!isImage(file.name) && !isVideo(file.name)) || mode == "list"}
                           <div
                              class="ui-text-base-content ui-w-full"
                              style:text-align={mode == "list" ? `center` : "left"}
                           >
                              {file.name}
                           </div>
                        {/if}
                     </div>
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
            class="ui-flex ui-flex-row ui-gap-2 ui-flex-wrap ui-rounded-md ui-p-2"
            style:background-color="hsl(var(--b2))"
         >
            <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-w-full ui-items-center">
               <ArgInput
                  label="Filter"
                  type="string"
                  bind:value={nameFilter}
                  size="xs"
                  width="18rem"
                  on:change={filterFiles}
                  clearable={true}
               />
               <ArgInput label="Size" type="int" bind:value={imageHeight} size="xs" width="8rem" />
               <!-- <ArgInput label="p" type="int" bind:value={$paddingTop} size="xs" width="10rem" /> -->
            </div>
            <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-none ui-items-center">
               <div class="ui-btn-group ui-btn-group-xs">
                  <IconButton
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
                     on:click={(_) => {
                        mode = "tiles";
                        imageHeight = imageHeightGrid;
                     }}
                  />
                  <IconButton
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
      {/if}
   </svelte:fragment>
</TwoColUI>

<style>
   .break {
      flex-basis: 100%;
      height: 0;
   }
   .file-video {
      border: solid 1px cadetblue;
   }
   .zoom-container {
      transition: 0.4s ease;
   }
   .zoom-container:hover {
      transform: scale(2);
      z-index: 1000;
   }
</style>
