<svelte:options accessors={true} />

<script>
   import IconButton from "crew-components/IconButton";
   import AlphaShell from "crew-components/AlphaShell";
   import ItemThumb from "./components/ItemThumb.svelte";
   import { getContext, onDestroy, tick } from "svelte";
   const { application } = getContext("external");
   const position = application.position;
   const { width, top, left } = position.stores;

   export let elementRoot;

   import Grid from "svelte-grid";
   import gridHelp from "svelte-grid/build/helper/index.mjs";

   let entities = [];

   let items = [];
   let locked = true;

   let gap = 4;
   let rowHeight = 52;
   let hm = 1;
   let COLS = 6;
   let cols = [[1200, COLS]];

   function updateItems() {
      items = [];
      for (const item of entities) {
         addItem(item);
      }
   }

   function toggleEdit() {
      locked = !locked;
      items = items.map((i) => {
         i[COLS].draggable = !locked;
         i[COLS].resizable = !locked;
         return i;
      });
      items = [...items];
      // updateItems();
   }

   onDestroy(
      width.subscribe((w) => {
         tick().then((_) => {
            COLS = Math.round((w - gap * 2) / (rowHeight * hm + gap));
            cols = [[1200, COLS]];
            updateItems();
            // logger.info(cols);
         });
      })
   );

   function itemClick(e, dataItem) {
      if (!locked) return;
      if (dataItem.source.toChat) {
         dataItem.source.toChat();
      } else if (dataItem.source.roll) {
         dataItem.source.roll();
      } else {
         dataItem.source.sheet.render(true);
      }
   }

   async function dropHandler(event) {
      const data = TextEditor.getDragEventData(event);
      // if (data.type != "Item") return;
      if (entities.find((e) => e.uuid == data.uuid)) return;
      const entity = await fromUuid(data.uuid);
      logger.info(entity);
      entities = [...entities, entity];
      addItem(entity, Math.round(event.offsetX / (rowHeight + gap))-1, Math.round(event.offsetY / (rowHeight + gap)));
   }

   function addItem(item, x = 0, y = 0) {
      let newItem = {
         [COLS]: gridHelp.item({
            w: 1,
            h: hm,
            x,
            y,
            draggable: !locked,
            resizable: !locked,
         }),
         id: item.id,
         source: item,
      };

      if (x == 0 && y == 0) {
         let findOutPosition = gridHelp.findSpace(newItem, items, COLS);
         newItem = {
            ...newItem,
            [COLS]: {
               ...newItem[COLS],
               ...findOutPosition,
            },
         };
      }
      items = [...items, newItem];
   }

   function reset() {
     entities = []
     items = []
   }

</script>

<AlphaShell bind:elementRoot id="grid">
   <div
      class="ui-p-1 ui-w-full ui-h-8 ui-flex ui-flex-row ui-iteems-centeer ui-gap-2"
      style="background-color: hsv(var(--b3))"
   >
      <IconButton icon="gg:arrow-top-left-r" on:click={updateItems} size="xs" />
      <IconButton icon="icon-park-solid:clear-format" on:click={reset} size="xs" />
      <IconButton
         icon={locked ? "material-symbols:edit-square" : "material-symbols:lock"}
         on:click={toggleEdit}
         size="xs"
      />
   </div>
   <div class="ui-h-full ui-w-full" style="background-color: hsv(var(--b1))" on:drop={dropHandler}>
      <Grid
         offset={{ top: -$top, left: -$left }}
         scroller={elementRoot}
         gap={[gap, gap]}
         {cols}
         {rowHeight}
         bind:items
         let:item
         let:dataItem
      >
         <div
            class="ui-h-full ui-w-full ui-rounded-md ui-flex ui-items-center ui-justify-center"
            style="background-color: #232323"
            class:ui-cursor-pointer={locked}
         >
            <ItemThumb maximize={true} item={dataItem.source} on:click={(e) => itemClick(e, dataItem)} />
         </div>
      </Grid>
   </div>
</AlphaShell>

<style>
   :global(.svlt-grid-shadow) {
      /* Back shadow */
      background: #444 !important;
   }
   :global(.svlt-grid-container) {
      /* Container color */
      /* background: #eee; */
   }
   :global(.svlt-grid-resizer::after) {
      /* Resizer color */
      border-color: white !important;
   }
</style>
