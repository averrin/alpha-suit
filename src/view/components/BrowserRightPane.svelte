<script>
   import {
      selectedBrowser,
      addTree,
      expanded,
      filterCompendium,
      system,
      compendiumTree,
   } from "../../modules/stores.js";
   import TreeItemComponent from "./TreeItem.svelte";
   import { onDestroy, tick } from "svelte";
   import FilterBar from "./FilterBar.svelte";
   import Tag from "crew-components/Tag";
   import Pagenation from "crew-components/Pagenation";
   import { sortContent, pageContent, filterItemPredicate, setting } from "crew-components/helpers";
   import { SETTINGS } from "../../modules/constants.js";

   let compendium;
   let children = [];
   let content = [];
   let packCode;

   let tree = {};
   let items = {};
   let root;
   let index;
   let currentPage = 1;
   let pageSize = setting(SETTINGS.PAGE_SIZE);
   let total = 0;
   let fic;
   let _fields = ["name"];
   let fields = ["name"];
   let aliases = $system?.aliases["Common"] || {};
   let extraInfo = [];

   function updateFields() {
      let fields = [..._fields];
      let si = [];
      si = $filterCompendium.sort?.map((s) => s.index)?.flat() || [];
      fields.push(...si);
      si = $filterCompendium.show?.map((s) => s.index)?.flat() || [];
      fields.push(...si);
      si = $filterCompendium.filters?.map((s) => s.index)?.flat() || [];
      fields.push(...si);
      logger.info(fields, $filterCompendium);
      return fields;
   }

   async function updateIndex() {
      updateFields();

      await compendium.getIndex({ fields: ["img", ...fields] }).then((i) => {
         index = i;
         compendium.index = index;
         logger.info(index);
      });
   }

   onDestroy(
      filterCompendium.subscribe((f) => {
         rebuild();
      })
   );

   function rebuild() {
      logger.info("rebuild");
      currentPage = 1;
      root = undefined;
      content = undefined;
      index = undefined;
      if (!compendium) return;
      packCode = `${compendium.metadata?.package}.${compendium.metadata?.name}`;

      if (game.modules.get("compendium-folders")?.active) {
         Promise.all([game.CF.FICFolderAPI.loadFolders(packCode), updateIndex()]).then(() => {
            logger.info("custom folders and index updated");
            game.customFolders.fic.folders.contents.forEach((f) => (f.icon = "fa-solid:folder"));
            fic = game.customFolders.fic.folders.contents;
            children = game.customFolders.fic.folders.contents.filter((f) => f.packCode == packCode && !f.parent);
            if (children && children.length > 0) {
               content = [];
            }
            setContent();
         });
      } else {
         Promise.all([updateIndex()]).then(setContent);
      }

      setContent();
   }

   onDestroy(
      selectedBrowser.subscribe((s) => {
         compendium = game.packs.get(s[0]) || $compendiumTree[s[0]].source;
         rebuild();
      })
   );

   function itemFilter(item) {
      if (typeof item === "string" || item instanceof String) {
         item = index.get(item);
      }
      return filterItemPredicate(item, $filterCompendium, aliases);
   }

   function folderFilter(folder) {
      folder.contents = folder.contents.filter(itemFilter);
      let ch = fic.filter((f) => folder.children.includes(f.data.id));
      ch = ch.filter(folderFilter);
      folder.children = ch.map((f) => f.data.id);
      return folder.contents.length > 0 || folder.children.length > 0;
   }

   function pageAndSort(content) {
      content = sortContent(content, $filterCompendium, aliases);
      content = pageContent(content, currentPage, pageSize);
      return content;
   }

   function setContent() {
      extraInfo = [];

      index = index || compendium.index;
      content = index.contents;
      if ($filterCompendium.filters?.length > 0) {
         if (fic && children?.length > 0) {
            children = children.filter(folderFilter);
            content = children[0]?.contents || [];
            total = content.length + children.length;
         } else {
            content = content.filter(itemFilter);
            total = content.length;
            content = pageAndSort(content);
         }
      } else {
         if (fic && children?.length > 0) {
            content = children[0]?.contents || [];
            total = content.length;
         } else {
            total = content.length;
            content = pageAndSort(content);
         }
      }

      init();
   }

   function init() {
      logger.info("init tree");
      items = addTree(
         { content, children },
         undefined,
         (item, source) => {
            if (typeof source === "string" || source instanceof String) {
               const new_source = index.get(source);
               item.source = new_source;
               item.name = new_source?.name;
               item.thumbnail = new_source?.img;
               if (new_source) {
                  item.source.thumbnail = new_source?.img || new_source?.thumbnail;
               }
            } else {
               item.source.thumbnail = source?.img || source?.thumbnail;
               item.thumbnail = source?.img || source?.thumbnail;
            }
            item.compendium = compendium;
            return item;
         },
         (c) => {
            if (typeof c === "string" || c instanceof String) {
               if (fic) {
                  c = fic.find((f) => f.id == c);
               } else {
                  return null;
               }
            }
            return c;
         }
      );
      root = items.find((i) => i.root);
      tree = {};
      for (const i of items) {
         tree[i.id] = i;
      }
   }

   function toggleExpanded(node) {
      expanded.update((ex) => {
         const isExpanded = ex.some((i) => i == node.id);
         if (isExpanded) {
            return ex.filter((i) => i != node.id);
         } else {
            ex.push(node.id);
            return ex;
         }
      });
   }

   async function itemClick(e) {
      const { node, event } = e.detail;
      const isFolder = node.source.contents;
      if (!isFolder) {
         logger.info(node);
         const item = await compendium.getDocument(node.source._id);
         item.sheet.render(true);
      } else {
         toggleExpanded(node);
      }
   }

   function setPage(d) {
      currentPage = currentPage + d;
      if (currentPage <= 0) {
         currentPage = 1;
         return;
      }
      const max = Math.ceil(total / pageSize);
      if (currentPage >= max) {
         currentPage = max;
         return;
      }
      setContent();
   }

   async function importItem(e, item) {
      e.stopPropagation();
      logger.info(item);
      const doc = await compendium.getDocument(item.source._id);
      doc.collection.importFromCompendium(compendium, doc.id);
      ui.notifications.info(`Imported: ${doc.name}`);
   }
</script>

{#if compendium && root}
   <div class="ui-flex ui-flex-col">
      <div class="ui-flex ui-flex-row ui-p-1 ui-justify-center ui-items-center ui-gap-2">
         <div class="ui-font-bold ui-text-lg">
            {compendium.title}
         </div>
         <iconify-icon
            icon="fa-solid:download"
            class="ui-text-lg icon-button"
            on:click={(_) => compendium.importDialog()}
         />
      </div>
      <div class="ui-p-1">
         <FilterBar filter={filterCompendium} />
      </div>
   </div>
   <div id={compendium.id} class="ui-p-2 ui-flex ui-flex-1 ui-flex-col ui-overflow-y-auto">
      <div>
         <TreeItemComponent
            node={root}
            bind:nodes={tree}
            isRoot={true}
            showTags={false}
            disableReorder={true}
            selected={selectedBrowser}
            on:click={itemClick}
            let:node
         >
            <div class="ui-flex ui-flex-row ui-gap-1" slot="right">
               {#each extraInfo as info}
                  <Tag tag={{ text: info(node.source) }} compact={true} />
               {/each}
               <iconify-icon
                  icon="fa-solid:download"
                  class="ui-text-lg icon-button ui-text-zinc-500"
                  on:click={(e) => importItem(e, node)}
               />
            </div>
         </TreeItemComponent>
      </div>
   </div>

   <div class="ui-flex ui-flex-row ui-p-1 ui-justify-center">
      <Pagenation bind:currentPage {total} {pageSize} on:update={setContent} />
   </div>
{/if}