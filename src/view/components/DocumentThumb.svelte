<script>
   import { logger } from "crew-components/helpers";

   export let item;
   export let fromCompendium = null;
   import { currentCollection } from "../../modules/stores.js";
   import { onDestroy } from "svelte";

   async function drag(e) {
      let id = $item.id;
      let type = $currentCollection.documentName;
      let data = { type, id, data: $item.data };
      let sData = { data: JSON.stringify(data) };
      e.dataTransfer.setData("text/plain", sData.data);
      if (fromCompendium) {
         const doc = await fromCompendium.getDocument($item._id);
         let newDoc = await doc.collection.importFromCompendium(fromCompendium, doc.id);
         type = doc.collection.documentName;
         id = newDoc.id;
         sData.data = JSON.stringify({ type, id });
         ui.notifications.info(`Imported: ${doc.name}`);
         e.dataTransfer.setData("text/plain", sData.data);
         logger.info("imported", sData, e.dataTransfer);
      }
   }
   let thumb;

   //TODO: update on updateActor / updateToken

   onDestroy(
      item.subscribe((i) => {
         thumb = i?.thumbnail;
         if (thumb == "icons/svg/mystery-man.svg" && (i?.data?.token?.img || i?.data?.prototypeToken?.texture?.src)) {
            thumb = i?.data?.token?.img || i?.data?.prototypeToken?.texture?.src;
         }
      })
   );
</script>

<div
   class="ui-w-full ui-h-full ui-border-none ui-rounded-md ui-bg-contain ui-bg-no-repeat"
   style:background-image="url({thumb})"
   alt=""
   draggable={true}
   on:pointerdown={() => null}
   on:click
   on:dragstart={drag}
   style:cursor="grab"
/>
