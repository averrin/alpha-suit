<script>
   import DataSegment from "../segments/DataSegment.svelte";
   import { getContext, onDestroy } from "svelte";
   let tokenStore = getContext("token");
   let token;
   let doc;
   const unsubscribe = tokenStore.subscribe((value) => {
      token = value;
      doc = token;
      if (doc.document) {
         doc = doc.document;
      }
   });

   onDestroy(unsubscribe);
   export let label = "";
   export let path;
   export let colors;
   export let icon;

   let color = "";
   let data;
   $: {
      if (doc) {
         data = globalThis.getProperty(doc.actor.getRollData(), path);

         if (colors && typeof colors === "object") {
            for (const [key, value] of Object.entries(colors)) {
               if (data.value >= key) {
                  color = value;
               }
            }
         }

         if (data.value > data.max) {
            color = "red";
         } else if (data.value == 0) {
            color = "grey";
         }
      }
   }
</script>

{#if doc}
   <span
      class="ui-flex ui-flex-row ui-gap-1"
      title="{Math.round((data.value / data.max) * 100)}%, left: {data.max - data.value}"
   >
      {#if icon != ""}
         <span class="ui-h-6 ui-w-6 ui-bg-cover" style="background-image: url({icon})" />
      {:else if label != ""}
         {label}:&nbsp;
      {/if}
      <span>
         <DataSegment path="{path}.value" {color} />
         /
         <DataSegment path="{path}.max" />
      </span>
   </span>
{/if}

<style lang="scss">
   .data-segment {
      display: flex;
      flex-direction: row;
      align-items: center;
   }
</style>
