<script>
   import { system } from "../../modules/stores.js";
   import ActorTokens from "./ActorTokens.svelte";
   import ActorInventory from "./ActorInventory.svelte";

   import SelectedDocument from "./SelectedDocument.svelte";
   import { writable } from "svelte/store";
   import { onDestroy, setContext } from "svelte";
   export let item;
   let token;
   let ts = writable(null);
   function getTokens(i) {
      return canvas.scene.tokens.contents.filter((t) => t.actor?.id == i.id) || [];
   }

   setContext("token", ts);
   onDestroy(
      item.subscribe((i) => {
         token = null;
         if (i && getTokens(i).length > 0) {
            token = getTokens(i)[0];
         }
         if (i) {
            ts.set(token || { actor: i });
         }
      })
   );
</script>

{#if $item}
   <div class="ui-p-2 ui-flex ui-flex-col ui-gap-2">
      <SelectedDocument bind:item />
      <ActorTokens bind:item />

      {#if $system.data?.selectedInfo && $system.data?.selectedInfo["Actor"] && $system.data?.selectedInfo["Actor"][$item.type]?.component}
         <div class="ui-flex ui-flex-row ui-gap-1 ui-items-center">
            <svelte:component this={$system.data?.selectedInfo["Actor"][$item.type]?.component} {item} />
         </div>
      {/if}

      {#if $ts}
         <ActorInventory item={ts} />
      {/if}
   </div>
{/if}
