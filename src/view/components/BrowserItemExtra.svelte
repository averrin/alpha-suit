<script>
   import Tag from "crew-components/Tag";
   import { onDestroy } from "svelte";
   import { system, browserMode } from "../../modules/stores.js";
   import ImportButton from "./ImportButton.svelte";
   import InspectButton from "./InspectButton.svelte";
   export let item;
   let modeName;

   let extraInfo = [];

   onDestroy(
      browserMode.subscribe((m) => {
         modeName = m.title || "Common";
      })
   );

</script>

<div class="ui-flex ui-flex-row ui-gap-1 ui-items-center">
   {#if $system.data?.extraInfo && $system.data?.extraInfo[modeName]?.component && (item.source?.data || item.source?.system)}
      <svelte:component this={$system.data?.extraInfo[modeName]?.component} {item} />
   {/if}

   {#each extraInfo as info}
      <Tag tag={{ text: info(item.source) }} compact={true} />
   {/each}
</div>
<ImportButton {item} />
{#if globalThis.game.modules.get("data-inspector")?.api}
  <InspectButton {item} />
{/if}
