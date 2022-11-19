<script>
   import CompendiumTreeView from "./CompendiumTreeView.svelte";
   import { compendiumTree } from "../../modules/stores.js";
   import { selectedBrowser } from "../../modules/stores.js";
   import { getContext, tick, onDestroy } from "svelte";
   import { setting } from "crew-components/helpers";
   import { SETTINGS } from "../../modules/constants.js";

   import BrowserRightPane from "./BrowserRightPane.svelte";

   const { application } = getContext("external");
   const position = application.position;
   const { height, width } = position.stores;
   let contentH = $height;
   onDestroy(
      height.subscribe((h) => {
         tick().then(() => {
            const tabs = document.getElementById("browser-tab-container");
            if (tabs) {
               contentH = h - tabs.clientHeight - 4;
            }
         });
      })
   );
   if ($height < 600) height.set(600);

   const unsub = selectedBrowser.subscribe((s) => {
      tick().then(() => {
         setTimeout((_) => {
            if (s.length > 0) {
               width.set(setting(SETTINGS.WINDOW_WIDTH_EXPANDED));
            } else {
               width.set(setting(SETTINGS.WINDOW_WIDTH_COLLAPSED));
            }
         }, 1);
      });
   });
   onDestroy(unsub);
</script>

<div class="ui-flex ui-flex-row ui-gap-2 ui-container">
   <div
      class="ui-bg-base-100 ui-flex-col ui-flex ui-pb-[26px]"
      class:ui-w-[40%]={$selectedBrowser.length > 0}
      class:ui-w-full={$selectedBrowser.length == 0}
      style="height: {contentH}px;"
   >
      <div class="ui-flex ui-flex-none ui-flex-col ui-p-2 ui-pb-0 ui-flex-col ui-gap-1">
         <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-items-center">
            <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-items-center ui-text-base-content">
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
         class="ui-bg-base-100 ui-flex-col ui-flex"
         class:ui-w-[60%]={$selectedBrowser.length > 0}
         style="height: {contentH + 8 - document.getElementById('browser-pagenation-container')?.clientHeight}px;"
      >
         {#if $selectedBrowser.length > 0}
            <BrowserRightPane />
         {/if}
      </div>
   {/if}
</div>
