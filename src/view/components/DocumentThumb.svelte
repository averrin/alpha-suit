<script>
   import { logger } from "crew-components/helpers";

   export let item;
   export let title;

   export let fromCompendium = null;
   import { currentCollection } from "../../modules/stores.js";
   import { onDestroy } from "svelte";

   async function drag(e) {
      let id = $item.id;
      let type = $currentCollection.documentName;
      logger.info($item);
      let data = { type, id, data: $item.data, uuid: $item.uuid };
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

   function getThumb(i) {
      let thumb = i?.thumbnail;
      if (
         thumb == "icons/svg/mystery-man.svg" &&
         (i?.data?.token?.img || i?.data?.prototypeToken?.texture?.src || i?.data?.icon)
      ) {
         thumb = i?.data?.token?.img || i?.data?.prototypeToken?.texture?.src || i?.data?.icon;
      }
      return thumb;
   }

   function onUpdate(i) {
      const thumbNew = getThumb(i);
      if (thumb != thumbNew) {
         thumb = thumbNew;
      }
   }

   const unsub = Hooks.on("updateActor", (i) => {
      if (i.id != $item.id) return;
      onUpdate(i);
   });
   const unsub2 = Hooks.on("updateToken", (i) => {
      if (i.id != $item.id) return;
      onUpdate(i);
   });
   const unsub3 = Hooks.on("updateItem", (i) => {
      if (i.id != $item.id) return;
      onUpdate(i);
   });
   onDestroy((_) => Hooks.off("updateActor", unsub));
   onDestroy((_) => Hooks.off("updateToken", unsub2));
   onDestroy((_) => Hooks.off("updateItem", unsub3));

   onDestroy(
      item.subscribe((i) => {
         onUpdate(i);
      })
   );
</script>

<div
   class="zoom-container ui-w-full ui-h-full ui-border-none ui-rounded-md ui-bg-contain ui-bg-no-repeat"
   style:background-image="url({thumb})"
   alt=""
   draggable={true}
   on:pointerdown={() => null}
   on:click
   on:dragstart={drag}
   style:cursor="grab"
   {title}
/>

<style>
   .zoom-container {
      transition: 0.4s ease;
   }
   .zoom-container:hover {
      transform: scale(1.4);
      z-index: 1000;
   }
</style>
