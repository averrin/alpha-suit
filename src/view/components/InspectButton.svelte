<script>
   import InlineButton from "crew-components/InlineButton";
   import { onHook, calculateValue, logger } from "crew-components/helpers";
   import { tick } from "svelte";

   export let item;
   export let size;
   const isString = (i) => i instanceof String || typeof i === "string";

   function updateItem() {
      if (item && isString(item)) {
         try {
            item = calculateValue(item, "actor");
            if (item) {
               item = { source: item };
            }
         } catch (_) {
            item = null;
         }
      }
     return item;
   }

   async function inspectItem(e, item) {
      e.stopPropagation();
      let doc = item.source ?? item;
      if (doc.compendium) {
         doc = await doc.compendium.getDocument(doc._id);
      }
      globalThis.game.modules.get("data-inspector")?.api?.inspect(doc);
   }
   updateItem();
   onHook(["updateActor", "controlToken", "targetToken"], _ => tick().then(updateItem));
</script>

{#if item && game.modules.get("data-inspector")?.api}
   <InlineButton
      title="Inspect"
      color="#71717a"
      icon="fa6-solid:magnifying-glass"
      on:click={(e) => inspectItem(e, updateItem())}
      {size}
   />
{/if}
