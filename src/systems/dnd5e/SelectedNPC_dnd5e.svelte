<script>
   import { onDestroy, setContext } from "svelte";
   import DataSegment from "../../view/hud/segments/DataSegment.svelte";
   import { writable } from "svelte/store";
   import { getFlag } from "crew-components/helpers";

   export let item;

   let ipEnabled;
   let ipMerchant;

   let token;
   let ts = writable(null);
   function getTokens(i) {
      return canvas.scene.tokens.contents.filter((t) => t.actor?.id == i.id) || [];
   }
   function formatCR(cr) {
      if (!cr) return "";
      if (parseFloat(cr) == 0.5) return "1/2";
      if (parseFloat(cr) == 0.25) return "1/4";
      if (parseFloat(cr) == 0.125) return "1/8";
      return cr;
   }

   onDestroy(
      item.subscribe((i) => {
         token = null;
         if (i && getTokens(i).length > 0) {
            token = getTokens(i)[0];
         }
         if (i) {
            ts.set(token || { actor: i });
         }
         ipEnabled = getFlag(token, "item-piles.data.enabled");
         ipMerchant = getFlag(token, "item-piles.data.isMerchant");
      })
   );
</script>

<div class="ui-flex ui-flex-col ui-gap-2 ui-w-full">
   <h2 class="ui-text-center ui-font-bold">NPC</h2>
   <div class="ui-flex ui-flex-row ui-gap-2">
      {#if globalThis.game.itempiles && ipEnabled}
         <div class="ui-input-group ui-input-group-md ui-w-auto">
            <span class="ui-font-bold">Item Piles</span>
            <div
               class="ui-pr-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
            >
               <iconify-icon icon="fa-solid:box-open" title="ItemPiles is enabled" />
               {#if ipMerchant}
                  <iconify-icon icon="fa6-solid:scale-balanced" title="Actor is a Merchant" />
               {/if}
            </div>
         </div>
      {/if}

      <div class="ui-input-group ui-input-group-md ui-w-auto">
         <span class="ui-font-bold">CR</span>
         <div
            class="ui-pr-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
         >
            <DataSegment path="details.cr" format={formatCR} />
         </div>
      </div>

      <div class="ui-input-group ui-input-group-md ui-w-auto">
         <span>
            <iconify-icon icon="fa-solid:shield-alt" />
         </span>
         <div
            class="ui-pr-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
         >
            <DataSegment path="attributes.ac.value" />
         </div>
      </div>
   </div>
</div>
