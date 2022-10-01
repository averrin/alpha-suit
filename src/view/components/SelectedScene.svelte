<script>
   import { onDestroy } from "svelte";

   import SelectedDocument from "./SelectedDocument.svelte";
   export let item;

   function activate() {
      logger.info($item);
      $item.activate();
   }
   let active = $item.active;

   const unsub = Hooks.on("updateScene", () => (active = $item?.active));
   onDestroy((_) => Hooks.off("updateScene", unsub));
   onDestroy(item.subscribe((i) => (active = i?.active)));
</script>

{#if $item}
   <div class="ui-p-2 ui-flex ui-flex-col ui-gap-2">
      <SelectedDocument bind:item />

      {#if !active}
         <div class="ui-btn ui-btn-primary ui-btn-md" on:click={activate}>Activate</div>
      {:else}
         <div class="ui-btn ui-btn-md disabled">Active</div>
      {/if}
   </div>
{/if}
