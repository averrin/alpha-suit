<script>
   import { currentCollection, selected, filter, treeItems } from "../../modules/stores.js";
   import FilterBar from "./FilterBar.svelte";
   import TreeView from "./TreeView.svelte";
   import CreateButtons from "./CreateButtons.svelte";
   import { SETTINGS, moduleId } from "../../modules/constants.js";
   import { setting } from "crew-components/helpers";

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
</script>

<div class="ui-flex ui-flex-none ui-flex-col ui-h-full">
   {#if showTip}
      <div class="ui-rounded ui-bg-white">
         <div class="ui-text ui-flex ui-flex-col ui-gap-3 ui-text-center ui-p-2">
            <div>
               Hold <kbd class="ui-kbd">shift</kbd> and drag to reorder items.
            </div>
            <div>Drop item preview on the canvas to add a token.</div>
            <div>
               <kbd class="ui-kbd">right-click</kbd> to select an item.
            </div>
            <div>
               <kbd class="ui-kbd">ctrl</kbd> + <kbd class="ui-kbd">right-click</kbd> to add an item to the selection.
            </div>
            <div class="ui-flex ui-flex-row ui-items-center ui-font-bold">
               You can find more information in the Help Center
               <iconify-icon
                  icon="clarity:help-solid"
                  class="ui-text-lg icon-button ui-flex-none"
                  on:click={AlphaSuit.showHelp}
                  on:pointerdown={(_) => null}
               />
            </div>
            <div class="ui-btn ui-btn-primary" on:click={closeTip}>Close the tip</div>
         </div>
      </div>
   {/if}

   <div class="ui-p-2">
      <div class="ui-tabs ui-tabs-boxed">
         <div class="ui-flex ui-flex-1 ui-flex-row ui-w-full ui-justify-center ui-items-center">
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
         <iconify-icon
            icon="clarity:help-solid"
            class="ui-text-lg icon-button ui-flex-none"
            on:click={AlphaSuit.showHelp}
            on:pointerdown={(_) => null}
         />
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
