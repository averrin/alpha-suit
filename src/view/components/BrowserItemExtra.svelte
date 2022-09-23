<script>
   import Tag from "crew-components/Tag";
   import { onDestroy } from "svelte";
   import { system, browserMode } from "../../modules/stores.js";
   import InlineButton from "crew-components/InlineButton";
   export let item;
   let modeName;

   let extraInfo = [];

   onDestroy(
      browserMode.subscribe((m) => {
         modeName = m.title || "Common";
      })
   );

   async function importItem(e, item) {
      e.stopPropagation();
      const doc = await item.compendium.getDocument(item.source._id);
      doc.collection.importFromCompendium(item.compendium, doc.id);
      ui.notifications.info(`Imported: ${doc.name}`);
   }
</script>

<div class="ui-flex ui-flex-row ui-gap-1 ui-items-center">
   {#if $system.data?.extraInfo && $system.data?.extraInfo[modeName]?.component && (item.source?.data || item.source?.system)}
      <svelte:component this={$system.data?.extraInfo[modeName]?.component} {item} />
   {/if}

   {#each extraInfo as info}
      <Tag tag={{ text: info(item.source) }} compact={true} />
   {/each}
   <InlineButton icon="fa-solid:download" color="#71717a" on:click={(e) => importItem(e, item)} />
</div>
