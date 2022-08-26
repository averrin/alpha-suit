<script>
   import CompendiumTreeView from "./CompendiumTreeView.svelte";
   import { compendiumTree } from "../../modules/stores.js";
   import { selectedBrowser, tagsStore } from "../../modules/stores.js";
   import { getContext, tick, onDestroy } from "svelte";

   import BrowserRightPane from "./BrowserRightPane.svelte";

   const { application } = getContext("external");
   const position = application.position;
   const { height, width } = position.stores;
   let contentH = $height;
   onDestroy(height.subscribe((h) => (contentH = h - 80)));
   if ($height < 600) height.set(600);

   const unsub = selectedBrowser.subscribe((s) => {
      tick().then(() => {
         if (s.length > 0) {
            width.set(880);
         } else {
            width.set(400);
         }
      });
   });
   onDestroy(unsub);
</script>

<div class="ui-flex ui-flex-row ui-gap-2 ui-container">
   <div
      class="ui-bg-white ui-flex-col ui-flex"
      class:ui-w-[40%]={$selectedBrowser.length > 0}
      class:ui-w-full={$selectedBrowser.length == 0}
      style="height: {contentH}px;"
   >
      <div class="ui-flex ui-flex-none ui-flex-col ui-p-2 ui-pb-0 ui-flex-col ui-gap-1">
         <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-items-center">
            <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-items-center">
               Items: <span class="ui-font-bold">{$compendiumTree ? Object.keys($compendiumTree)?.length - 1 : 0}</span>
            </div>
         </div>
      </div>
      <div class="ui-flex ui-flex-1 ui-flex-col ui-overflow-y-auto">
         <CompendiumTreeView />
      </div>
   </div>
   {#if $selectedBrowser.length > 0}
      <div
         class="ui-bg-white ui-flex-col ui-flex"
         class:ui-w-[60%]={$selectedBrowser.length > 0}
         style="height: {contentH}px;"
      >
         {#if $selectedBrowser.length > 0}
            <BrowserRightPane />
         {/if}
      </div>
   {/if}
</div>
