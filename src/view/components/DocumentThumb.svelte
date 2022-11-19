<script>
   import { logger, setting } from "crew-components/helpers";
   import { isPremium } from "crew-components/premium";
   import { SETTINGS } from "../../modules/constants.js";

   export let item;
   export let title;
   export let draggable=true;
   export let maximize = false;

   export let fromCompendium = null;
   import { currentCollection } from "../../modules/stores.js";
   import { onDestroy, tick } from "svelte";

   async function drag(e) {
      let id = $item.id;
      let type = $item?.compendium?.metadata?.type ?? $currentCollection.documentName;
      let data = {
         type,
         id,
         data: $item.data,
         uuid: $item.uuid,
         compendium: fromCompendium?.metadata?.id,
         _id: $item._id,
      };
      let sData = { data: JSON.stringify(data) };
      e.dataTransfer.setData("text/plain", sData.data);
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

   async function handleDrop(event) {
      const data = TextEditor.getDragEventData(event);
      let i;
      if (!$item.document && $item.compendium) {
         i = await $item.compendium.getDocument($item._id);
         $item.thumbnail = data.texture.src;
      } else {
         i = $item;
      }
      if (data.type != "Tile") return;

      if (isPremium() && i.documentName == "Actor") {
         const mode = setting(SETTINGS.DND_ACTOR_MODE);
         if (mode == "portrait" || mode == "both") {
            i.update({ img: data.texture.src });
         }
         if (mode == "token" || mode == "both") {
            i.update({
               "prototypeToken.texture.src": data.texture.src,
               "token.texture.src": data.texture.src,
            });
         }
      } else {
         i.update({ img: data.texture.src });
      }

      // i.update({ img: data.texture.src });
      tick().then((_) => {
         onUpdate($item);
      });
   }
</script>

<div
   class="zoom-container ui-w-full ui-h-full ui-border-none ui-rounded-md ui-bg-contain ui-bg-no-repeat"
   style:background-image="url({thumb})"
  style:background-size={maximize ? "cover" : "contain"}
   alt=""
  {draggable}
   on:pointerdown={() => null}
   on:click
   on:dragstart={drag}
   style:cursor="grab"
   {title}
   on:drop={handleDrop}
   on:click
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
