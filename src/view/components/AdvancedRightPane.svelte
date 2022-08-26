<script>
   import AdvancedTreeView from "./AdvancedTreeView.svelte";
   import FilterBar from "./FilterBar.svelte";
   import { filterAdvanced, system } from "../../modules/stores.js";
   import { TreeItem } from "../../modules/Tree.js";
   import TreeItemComponent from "./TreeItem.svelte";
   import { pageContent, sortContent, filterItemPredicate, showGetter } from "crew-components/helpers";
   import Pagenation from "crew-components/Pagenation";
   import { onDestroy } from "svelte";
   import Tag from "crew-components/Tag";
   import { moduleId, SETTINGS } from "../../modules/constants.js";
   import { logger, setting } from "crew-components/helpers";

   export let mode;

   let extraInfo = [];

   let currentPage = 1;
   let pageSize = setting(SETTINGS.PAGE_SIZE);
   let total = 0;
   let fields;
   let _fields = ["name", "type", "img", "thumbnail"];
   let ignored = setting(SETTINGS.IGNORED_PACKS);

   async function processPack(pack) {
      const index = await pack.getIndex({ fields });
      let items = index.contents;
      items = items.filter((i) => $mode.subtypes.includes(i.type) && i.name != "#[CF_tempEntity]");
      items.forEach((i) => (i.compendium = pack));
      total += items.length;
      return items;
   }
   let content = [];
   let fullContent = [];
   let aliases = {};
   let modeName = $mode.title || "Common";
   if ($system && $system.aliases) {
      aliases = $system.aliases[modeName];
   }
   let fc;

   function setContent() {
      extraInfo = [];

      let show = $filterAdvanced.show;

      if (show?.length > 0) {
         for (let s of show) {
            extraInfo.push(showGetter(aliases, s));
         }
      }

      const f = updateFields();
      if (JSON.stringify(f) != JSON.stringify(fields)) {
         fields = f;
         init();
         return;
      }

      fc = sortContent(
         fullContent.filter((item) => filterItemPredicate(item, $filterAdvanced, aliases)),
         $filterAdvanced,
         aliases
      );
      total = fc.length;
      if (total < currentPage * pageSize) {
         currentPage = 1;
      }
      content = pageContent(fc, currentPage, pageSize).map((i) => {
         i.thumbnail = i.thumbnail || i.img;
         const item = TreeItem.from(i);
         item.compendium = i.compendium;
         return item;
      });
   }

   function updateFields() {
      let fields = [..._fields];
      if ($system.data?.extraInfo && $system.data?.extraInfo[$mode.title]) {
         fields.push(...$system.data?.extraInfo[$mode.title].index);
      }
      let si = [];
      si = $filterAdvanced.sort?.map((s) => s.index)?.flat() || [];
      fields.push(...si);
      si = $filterAdvanced.show?.map((s) => s.index)?.flat() || [];
      fields.push(...si);
      si = $filterAdvanced.filters?.map((s) => s.index)?.flat() || [];
      fields.push(...si);
      logger.info(fields, $filterAdvanced);
      return fields;
   }

   function init() {
      total = 0;
      content = [];
      fullContent = [];
      currentPage = 1;
      if ($system && $system.aliases) {
         aliases = $system.aliases[modeName];
      }
      let packs = game.packs.contents
         .filter((c) => !ignored.includes(c.metadata.label))
         .filter((c) => c.metadata.type == $mode.type);
      for (const pack of packs) {
         processPack(pack).then((items) => {
            if (!items || items.length == 0) return;
            fullContent.push(...items);
            setContent();
            // foundry.utils.debounce(setContent, 200)();
         });
      }
   }
   fields = updateFields();
   onDestroy(mode.subscribe(init));
   onDestroy(filterAdvanced.subscribe(setContent));

   async function importItem(e, item) {
      e.stopPropagation();
      const doc = await item.compendium.getDocument(item.source._id);
      doc.collection.importFromCompendium(item.compendium, doc.id);
      ui.notifications.info(`Imported: ${doc.name}`);
   }

   async function itemClick(e) {
      const { node, event } = e.detail;
      logger.info(node);
      const item = await node.compendium.getDocument(node.source._id);
      item.sheet.render(true);
   }

   async function importFiltered() {
      // TODO: add confirmation
      for (const item of fc) {
         (async (item) => {
            const doc = await item.compendium.getDocument(item.source._id);
            doc.collection.importFromCompendium(item.compendium, doc.id);
            ui.notifications.info(`Imported: ${doc.name}`);
         })(item);
      }
   }

   async function exportFiltered() {
      let table = await RollTable.createDialog();

      const citems = fc.map((item) => ({
         type: CONST.TABLE_RESULT_TYPES.COMPENDIUM,
         collection: item.compendium,
         text: item.name,
         img: item.img || item.thumbnail,
         weight: 1,
         range: [1, 1],
      }));
      await table.update({
         results: citems,
      });
      table.normalize();
      ui.notifications.info(`Rolltable ${table.data.name} with ${table.results.size} entries was generated.`);
   }
</script>

<div class="ui-flex ui-flex-col">
   <div class="ui-flex ui-flex-row ui-p-1 ui-justify-center ui-items-center ui-gap-2 ui-px-2">
      <div class="ui-font-bold ui-text-lg ui-flex-1 ui-w-full ui-text-center">{$mode.title}: {total}</div>
      <div class="ui-flex-none ui-flex-row ui-items-center ui-flex ui-gap-2">
         <iconify-icon icon="fa-solid:download" class="ui-text-lg icon-button" on:click={(_) => importFiltered()} />
         {#if fc?.length > 0}
            <div class="ui-btn ui-btn-xs" on:click={exportFiltered}>Export</div>
         {/if}
      </div>
   </div>
</div>

<div id={$mode.title} class="ui-p-2 ui-flex ui-flex-1 ui-flex-col ui-overflow-y-auto">
   <div class="ui-flex ui-flex-col ui-gap-1">
      {#each content as node (node.id)}
         <TreeItemComponent {node} on:click={itemClick}>
            <div class="ui-flex ui-flex-row ui-gap-1 ui-items-center" slot="right">
               {#if $system.data?.extraInfo && $system.data?.extraInfo[$mode.title]?.component && node.source?.data}
                  <svelte:component this={$system.data?.extraInfo[$mode.title]?.component} item={node} />
               {/if}

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
      {/each}
   </div>
</div>

<div class="ui-flex ui-flex-row ui-p-1 ui-min-h-8 ui-justify-center" style="border-top: 1px solid #ccc">
   <Pagenation bind:currentPage {total} {pageSize} on:update={setContent} />
</div>
