<script>
   import { currentCollection, selected, filter, treeItems, aliases, tagsStore } from "../../modules/stores.js";
   import FilterBar from "./FilterBar.svelte";
   import TreeView from "./TreeView.svelte";
   import CreateButtons from "./CreateButtons.svelte";
   import { SETTINGS, moduleId } from "../../modules/constants.js";
   import { setting, toggleFilter } from "crew-components/helpers";
   import InlineButton from "crew-components/InlineButton";
   import HelpControls from "../help/HelpControls.svelte";
   import Tags from "crew-components/Tags";
   import { createFilter } from "crew-components/helpers";
   import { onDestroy } from "svelte";

   let ftags = $tagsStore.filter((t) => t.fav);
   onDestroy(
      tagsStore.subscribe((tags) => {
         ftags = tags.filter((t) => t.fav);
      })
   );

   const availableTabs = [
      { title: "Actors", get: () => game.actors, icon: "fa-solid:users" },
      { title: "Items", get: () => game.items, icon: "fa-solid:suitcase" },
      // { title: "Scenes", get: () => game.scenes, icon: "fa-solid:map" },
   ];
   let mode = availableTabs[0].title;
   function selectMode(t) {
      mode = t.title;
      $currentCollection = t.get();
      $selected = [];
      $filter = {};
   }
   let showTip = setting(SETTINGS.SHOW_TREE_TIP);
   function closeTip() {
      showTip = false;
      game.settings.set(moduleId, SETTINGS.SHOW_TREE_TIP, false);
   }

   function onTagClick(_, tag) {
      filter.update((f) => {
         f.filters = f.filters || [];
         f.filters.push(createFilter({}, tag, ""));
         return f;
      });
   }
</script>

<div class="ui-flex ui-flex-none ui-flex-col ui-h-full">
   {#if showTip}
      <div class="ui-rounded ui-bg-base-100">
         <div class="ui-text ui-flex ui-flex-col ui-gap-3 ui-p-2">
            <HelpControls />
            <div class="ui-flex ui-flex-row ui-items-center ui-font-bold">
               You can find more information in the Help Center
               <iconify-icon
                  icon="clarity:help-solid"
                  class="ui-text-lg icon-button ui-flex-none"
                  on:click={AlphaSuit.showHelp}
                  on:pointerdown={(_) => null}
               />
            </div>
            <div class="ui-btn ui-btn-md ui-btn-primary" on:click={closeTip}>Close the tip</div>
         </div>
      </div>
   {/if}

   <div class="ui-p-1">
      <div class="ui-tabs ui-tabs-boxed">
         <div class="ui-flex ui-flex-1 ui-flex-row ui-w-full ui-justify-center ui-items-center">
            {#each availableTabs as t (t.title)}
               <a
                  class="ui-tab ui-tab-xs ui-text-base-content"
                  on:click={() => selectMode(t)}
                  class:ui-tab-active={t.title == mode}
               >
                  <iconify-icon icon={t.icon} class="ui-mr-2 ui-text-lg" />
                  {t.title}
               </a>
            {/each}
         </div>
         <iconify-icon
            icon="clarity:help-solid"
            class="ui-text-lg icon-button ui-flex-none ui-text-base-content"
            on:click={globalThis.AlphaSuit.showHelp}
            on:pointerdown={(_) => null}
         />
      </div>
   </div>

   <div class="ui-bg-base-100 ui-p-2 ui-h-full ui-pb-[120px]">
      <div class="ui-flex ui-flex-1 ui-flex-col">
         <FilterBar {filter} />
      </div>

      <div class="ui-flex ui-flex-row ui-gap-1 ui-flex-1 ui-items-center">
         <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-items-center ui-text-base-content">
            Items: <span class="ui-font-bold">{$treeItems ? Object.keys($treeItems)?.length - 1 : 0}</span>
         </div>

         <InlineButton icon="fa-solid:map" on:click={(_) => toggleFilter(filter, "@onScene", "onScene", aliases)} />
         <InlineButton icon="fa-solid:star" on:click={(_) => toggleFilter(filter, "@fav", "fav", aliases)} />
         <CreateButtons />
      </div>

      {#if ftags.length > 0}
         <Tags {onTagClick} tags={ftags.map((t) => t.text)} disable={true} />
      {/if}

      <div class="ui-flex ui-flex-1 ui-flex-col ui-overflow-y-auto ui-h-full">
         <TreeView />
      </div>
   </div>
</div>
