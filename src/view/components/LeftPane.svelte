<script>
   import { currentCollection, selected, filter, treeItems } from "../../modules/stores.js";
   import FilterBar from "./FilterBar.svelte";
   import TreeView from "./TreeView.svelte";
   import CreateButtons from "./CreateButtons.svelte";

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
</script>

<div class="ui-flex ui-flex-none ui-flex-col ui-h-full">
   <div class="ui-p-2">
      <div class="ui-tabs ui-tabs-boxed">
         {#each availableTabs as t (t.title)}
            <a
               class="ui-tab ui-tab-xs ui-text-black"
               on:click={() => selectMode(t)}
               class:ui-tab-active={t.title == mode}
            >
               <iconify-icon icon={t.icon} class="ui-mr-2 ui-text-lg" />
               {t.title}
            </a>
         {/each}
      </div>
   </div>

   <div class="ui-bg-white ui-p-2 ui-h-full ui-pb-[120px]">
      <div class="ui-flex ui-flex-1 ui-flex-col">
         <FilterBar {filter} />
      </div>

      <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-items-center">
         <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-items-center">
            Items: <span class="ui-font-bold">{$treeItems ? Object.keys($treeItems)?.length - 1 : 0}</span>
         </div>
         <CreateButtons />
      </div>
      <div class="ui-flex ui-flex-1 ui-flex-col ui-overflow-y-auto ui-h-full">
         <TreeView />
      </div>
   </div>
</div>
