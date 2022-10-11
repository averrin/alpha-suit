<script>
   import { onDestroy } from "svelte";
   import { capitalize } from "crew-components/helpers";

   export let item;
   let data;

   onDestroy(
      item.subscribe((i) => {
         if (!i) {
            data = null;
            return;
         }
         data = i?.system || i?.data?.data || i?.data;
      })
   );
</script>

{#if data}
   <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-wrap">
      {#if data.price}
         <div class="ui-input-group ui-input-group-md ui-w-auto">
            <span class="ui-font-bold"> Price </span>
            <div
               class="ui-pr-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
            >
               {data.price}<span class="ui-font-bold">gp</span>
            </div>
         </div>
      {/if}
      {#if data.weight}
         <div class="ui-input-group ui-input-group-md ui-w-auto">
            <span class="ui-font-bold"> Weight </span>
            <div
               class="ui-pr-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
            >
               {data.weight}
            </div>
         </div>
      {/if}
      {#if data.quantity > 1}
         <div class="ui-input-group ui-input-group-md ui-w-auto">
            <span class="ui-font-bold"> Quantity </span>
            <div
               class="ui-pr-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
            >
               {data.quantity}
            </div>
         </div>
      {/if}

      {#if data.rarity}
         <div class="ui-input-group ui-input-group-md ui-w-auto">
            <span class="ui-font-bold"> Rarity </span>
            <div
               class="ui-pr-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
            >
               {data.rarity}
            </div>
         </div>
      {/if}

      {#each Object.entries($item.labels) as [label, val]}
         {#if val && val !== "" && val.includes && !val.includes("undefined") && !val.includes("[null]")}
            <div class="ui-input-group ui-input-group-md ui-w-auto">
               <span class="ui-font-bold"> {capitalize(label)} </span>
               <div
                  class="ui-pr-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300 ui-whitespace-nowrap"
               >
                  {val.replace(" Ability Check", "")}
               </div>
            </div>
         {/if}
      {/each}
   </div>
{/if}
