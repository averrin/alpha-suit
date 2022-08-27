<script>
   // import { selectedBrowser } from "../../modules/stores.js";
   import { getContext, onDestroy } from "svelte";
   import FilterPanel from "./FilterPanel.svelte";
   import AdvancedRightPane from "./AdvancedRightPane.svelte";
   import { filterAdvanced, browserMode } from "../../modules/stores";

   const { application } = getContext("external");
   const position = application.position;
   const { height, width } = position.stores;
   let contentH = $height;
   onDestroy(height.subscribe((h) => (contentH = h - 80)));
   onDestroy(browserMode.subscribe((m) => filterAdvanced.set({})));
   if ($height < 600) height.set(600);
   if ($width < 800) width.set(800);
</script>

<div class="ui-flex ui-flex-row ui-gap-2 ui-container">
   <div class="ui-bg-white ui-flex-col ui-flex ui-w-[40%]" style="height: {contentH}px;">
      <div class="ui-flex ui-flex-none ui-flex-col ui-p-2 ui-pb-0 ui-flex-col ui-gap-1 ui-h-full">
         <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-items-center ui-h-full">
            <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-items-center ui-h-full">
               <FilterPanel />
            </div>
         </div>
      </div>
      <!-- <div class="ui-flex ui-flex-1 ui-flex-col ui-overflow-y-auto">scroll view</div> -->
   </div>
   <div class="ui-bg-white ui-flex-col ui-flex ui-w-[60%]" style="height: {contentH}px;">
      <AdvancedRightPane />
   </div>
</div>
