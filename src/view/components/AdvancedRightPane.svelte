<script>
   import { filterAdvanced, system, browserMode } from "../../modules/stores.js";
   import { TreeItem } from "../../modules/Tree.js";
   import TreeItemComponent from "./TreeItem.svelte";
   import { pageContent, sortContent, filterItemPredicate, showGetter } from "crew-components/helpers";
   import Pagenation from "crew-components/Pagenation";
   import { onDestroy } from "svelte";
   import { moduleId, SETTINGS } from "../../modules/constants.js";
   import { logger, setting, updateFields } from "crew-components/helpers";
   import InlineButton from "crew-components/InlineButton";
   import BrowserItemExtra from "./BrowserItemExtra.svelte";

   let extraInfo = [];

   let currentPage = 1;
   let pageSize = setting(SETTINGS.PAGE_SIZE);
   let total = 0;
   let fields;
   let _fields = ["name", "type", "img", "thumbnail"];
   let ignored = setting(SETTINGS.IGNORED_PACKS);
   let content = [];
   let fullContent = [];
   let modeName;
   let aliases = {};
   if ($system && $system.aliases) {
      aliases = $system.aliases[modeName];
   }
   let fc;

   async function processPack(pack, mn) {
      if (mn != modeName) return;
      const index = await pack.getIndex({ fields });
      if (mn != modeName) return;
      let items = index.contents;
      if ($browserMode.subtypes?.length > 0) {
         items = items.filter((i) => $browserMode.subtypes.includes(i.type) && i.name != "#[CF_tempEntity]");
      }
      items.forEach((i) => (i.compendium = pack));
      total += items.length;
      return items;
   }

   function setContent() {
      extraInfo = [];

      let show = $filterAdvanced.show;

      if (show?.length > 0) {
         for (let s of show) {
            extraInfo.push(showGetter(aliases, s));
         }
      }

      let systemExtraInfo = [];
      if ($system.data?.extraInfo && $system.data?.extraInfo[modeName]) {
         systemExtraInfo = $system.data?.extraInfo[modeName];
      }

      const f = updateFields([_fields, ...($system.indexFields ?? [])].flat(), $filterAdvanced, systemExtraInfo);
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

   function init() {
      let systemExtraInfo = [];
      if ($system.data?.extraInfo && $system.data?.extraInfo[modeName]) {
         systemExtraInfo = $system.data?.extraInfo[modeName];
      }
      fields = updateFields([_fields, ...($system.indexFields ?? [])].flat(), $filterAdvanced, systemExtraInfo);
      // debugger;
      // logger.info(fields, $filterAdvanced, modeName);

      total = 0;
      content = [];
      fullContent = [];
      currentPage = 1;

      let packs = game.packs.contents
         .filter((c) => !ignored.includes(c.metadata.label))
         .filter((c) => c.metadata?.type == $browserMode.type);
      for (const pack of packs) {
         processPack(pack, modeName).then((items) => {
            if (!items || items.length == 0) return;
            fullContent.push(...items);
            setContent();
            // foundry.utils.debounce(setContent, 200)();
         });
      }
   }
   const unsub = browserMode.subscribe((m) => {
      if (modeName == m.title) return;
      modeName = m.title || "Common";
      if ($system && $system.aliases) {
         aliases = $system.aliases[modeName];
      }
      init();
   });
   const unsub2 = filterAdvanced.subscribe(setContent);
   onDestroy(() => {
      unsub();
      unsub2();
   });

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
         collection: `${item.compendium.metadata.package}.${item.compendium.metadata.name}`,
         text: item.name,
         img: item.img || item.thumbnail,
         weight: 1,
         range: [1, 1],
         id: item._id,
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
      <div class="ui-font-bold ui-text-lg ui-flex-1 ui-w-full ui-text-center ui-text-base-content">
         {modeName}: {total}
      </div>
      <div class="ui-flex-none ui-flex-row ui-items-center ui-flex ui-gap-2">
         <InlineButton icon="fa-solid:download" color="#71717a" on:click={(e) => importFiltered()} />
         {#if fc?.length > 0}
            <div class="ui-btn ui-btn-xs" on:click={exportFiltered}>Export</div>
         {/if}
      </div>
   </div>
</div>

<div id={modeName} class="ui-p-2 ui-flex ui-flex-1 ui-flex-col ui-overflow-y-auto">
   <div class="ui-flex ui-flex-col ui-gap-1">
      {#each content as node (node.id)}
         <TreeItemComponent {node} on:click={itemClick} extraComponents={(_) => [BrowserItemExtra]}>
            <span
               class="ui-link ui-font-bold !ui-text-[#999]"
               slot="info"
               on:click={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  node.compendium.apps[0].render(true);
               }}
            >
               {node.compendium.title}
            </span>
         </TreeItemComponent>
      {/each}
   </div>
</div>

<div
   class="ui-flex ui-flex-row ui-p-1 ui-min-h-8 ui-items-center ui-justify-center"
   style="border-top: 1px solid hsl(var(--b2))"
>
   <Pagenation bind:currentPage {total} {pageSize} on:update={setContent} />
</div>
