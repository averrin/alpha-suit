<script>
   export let item;
   import InlineButton from "crew-components/InlineButton";

   async function importItem(e, item) {
      e.stopPropagation();
      const doc = await item.compendium.getDocument(item.source._id);
      doc.collection.importFromCompendium(item.compendium, doc.id);
      ui.notifications.info(`Imported: ${doc.name}`);
   }
</script>

<InlineButton icon="fa-solid:download" color="#71717a" on:click={(e) => importItem(e, item)} title="Import" />
