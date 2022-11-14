<script>
   export let item;
   import InlineButton from "crew-components/InlineButton";

   async function inspectItem(e, item) {
      e.stopPropagation();
      let doc = item.source ?? item;
      if (doc.compendium) {
         doc = await doc.compendium.getDocument(doc._id);
      }
      globalThis.game.modules.get("data-inspector")?.api?.inspect(doc);
   }
</script>

<InlineButton title="Inspect" color="#71717a" icon="fa6-solid:magnifying-glass" on:click={(e) => inspectItem(e, item)} />
