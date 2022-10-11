<script>
   import { capitalize } from "crew-components/helpers";
   import { onDestroy } from "svelte";

   export let item;
   let data;
   let components;

   function getDamageTypes(item) {
      const damage = item.data.data.damage;
      const types = damage?.parts;
      return types;
   }

   onDestroy(
      item.subscribe((i) => {
         if (!i) {
            components = null;
            return;
         }
         data = i?.system || i?.data?.data || i?.data;
         components = data?.components;
      })
   );
</script>

{#if components}
   <div class="ui-flex ui-flex-col ui-gap-2 ui-w-full">
      <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-wrap">
         <div class="ui-input-group ui-input-group-md ui-w-auto">
            <span class="ui-font-bold">Components</span>
            <div
               class="ui-border ui-flex-wrap ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-pr-4 ui-bg-base-300 ui-whitespace-nowrap"
            >
               {#if components}
                  {#if components.vocal}
                     V
                  {/if}

                  {#if components.somatic}
                     S
                  {/if}

                  {#if components.material}
                     M
                  {/if}

                  {#if components.concentration}
                     <span class="ui-font-bold">C</span>
                  {/if}
                  {#if components.ritual}
                     <span class="ui-font-bold">R</span>
                  {/if}
               {/if}
            </div>
         </div>

         {#each Object.entries($item.labels) as [label, val]}
            {#if val && val !== "" && label != "components" && label != "materials" && !val.includes("undefined")}
               <div class="ui-input-group ui-input-group-md ui-w-auto">
                  <span class="ui-font-bold"> {capitalize(label)} </span>
                  <div
                     class="ui-pr-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300 ui-whitespace-nowrap"
                  >
                     {val}
                  </div>
               </div>
            {/if}
         {/each}
      </div>
   </div>
{/if}
