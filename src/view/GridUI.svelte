<svelte:options accessors={true} />

<script>
   import { v4 as uuidv4 } from "uuid";
   import IconButton from "crew-components/IconButton";
   import InlineButton from "crew-components/InlineButton";
   import AlphaShell from "crew-components/AlphaShell";
   import ItemThumb from "./components/ItemThumb.svelte";
   import DocumentThumb from "./components/DocumentThumb.svelte";
   import ActiveEffectThumb from "./components/ActiveEffectThumb.svelte";
   import RemoveButton from "crew-components/RemoveButton";
   import ArgInput from "crew-components/ArgInput";
   import EditWidgetDialog from "./EditWidgetDialog.svelte";
   import { gridLayout } from "../modules/stores.js";
   import { getContext, onDestroy, tick } from "svelte";
   const { application } = getContext("external");
   const position = application.position;
   const { width, height, top, left } = position.stores;
   import { writable } from "svelte/store";
   import { moduleId } from "../modules/constants.js";

   import { TJSProseMirror } from "@typhonjs-fvtt/svelte-standard/component";

   export let elementRoot;

   import Grid from "svelte-grid";
   import gridHelp from "svelte-grid/build/helper/index.mjs";
   import FileThumb from "./components/FileThumb.svelte";
   import { notify } from "../modules/notify";
   import CreateApplication from "crew-components/AlphaApplication";
   import { isPremium } from "crew-components/premium";

   let entities = [];
   let gap = 4;
   let rowHeight = 52;
   let hm = 1;
   let COLS = 6;
   let ROWS = $height / (rowHeight * hm);
   let cols = [[1200, COLS]];

   let items = [];
   let layoutId = uuidv4();
   let layoutName = `Grid #${$gridLayout.length}`;
   if ($gridLayout.length > 0) {
      layoutId = $gridLayout[0].layoutId;
   } else {
      serializeItems(true);
   }
   tick().then(async (_) => {
      items = await deserializeItems();
      resizeItems();
   });
   let locked = true;

   function _resizeItems() {
      const old_items = [...items];
      items = [];
      for (const item of old_items) {
         const oc = Object.keys(item)[0];
         let x = item[oc].x;
         if (x > COLS - 1) {
            x = 0;
         }
         let y = item[oc].y;
         if (y > ROWS - 1) {
            y = 0;
         }
         const w = item[oc].w;
         const h = item[oc].h;
         delete item[oc];
         addItem(item.source, x, y, w, h);
      }
      serializeItems();
   }
   const resizeItems = foundry.utils.debounce(_resizeItems, 50);

   async function deserializeItems() {
      entities = [];
      const l = $gridLayout.find((l) => l.layoutId == layoutId);
      let layout = l?.layout ?? [];
      layoutId = l?.layoutId ?? layoutId;
      layoutName = l?.name ?? layoutName;
      rowHeight = l?.options?.rowHeight ?? rowHeight;
      for (const i of layout) {
         let source;
         if (i.uuid) {
            source = await fromUuid(i.uuid);
         } else if (i.type == "Text") {
            source = {
               text: i.persist,
               ...i,
            };
         } else if (i.type == "File") {
            source = {
               name: i.id.split("/")[i.id.split("/").length - 1],
               ...i,
            };
         } else if (i.type == "ActiveEffect") {
            source = game.dfreds?.effects?.all.find((e) => e._id == i.id);
            source.type = "ActiveEffect";
            source.id = i.id;
         } else {
            continue;
         }
         i.source = source;
         entities.push(source);
      }
      return layout.filter((i) => i.source);
   }

   function serializeItems(force = false) {
      if (items.length == 0 && !force) return;
      let layout = items.map((i) => {
         return { ...i };
      });
      for (const i of layout) {
         delete i.source;
      }
      // logger.info(JSON.stringify(layout));
      // logger.info(layout);
      gridLayout.update((gl) => {
         let l = gl.find((l) => l.layoutId == layoutId);
         if (!l) {
            layoutId = uuidv4();
            l = { layoutId };
            gl.push(l);
         }
         l.layout = layout;
         l.name = layoutName;
         if (!l.options) {
            l.options = {};
         }
         l.options.rowHeight = rowHeight;
         return gl;
      });
   }

   function updateItems() {
      const old_items = [...items];
      items = [];
      for (const item of old_items) {
         const oc = Object.keys(item)[0];
         let x = 0;
         let y = 0;
         const w = item[oc].w;
         const h = item[oc].h;
         delete item[oc];
         addItem(item.source, x, y, w, h);
      }
      serializeItems();
   }

   function toggleEdit() {
      locked = !locked;
      items = items.map((i) => {
         i[COLS].draggable = !locked;
         i[COLS].resizable = !locked;
         return i;
      });
      items = [...items];
      serializeItems();
   }

   onDestroy(
      width.subscribe((w) => {
         tick().then((_) => {
            const oc = COLS;
            COLS = Math.round((w - gap * 2) / (rowHeight * hm + gap));
            if (COLS == oc) return;
            cols = [[1200, COLS]];
            resizeItems();
            // logger.info(cols);
         });
      }),
      height.subscribe((h) => {
         tick().then((_) => {
            ROWS = h / (rowHeight * hm);
            resizeItems();
            // logger.info(cols);
         });
      })
   );

   async function itemClick(e, dataItem) {
      if (dataItem.type == "ActiveEffect") {
         game.dfreds.effectInterface.toggleEffect(dataItem.source.name);
         return;
      }
      if (dataItem.type == "Macro") {
         dataItem.source.execute();
         return;
      }
      if (dataItem.type == "Scene") {
         dataItem.source.view();
         return;
      }
      if (dataItem.type == "Actor") {
         // dataItem.source.sheet.render(true);
         const token = canvas.tokens.placeables.find((t) => t.actor?.id == dataItem.source?.id);
         logger.info(token);
         if (token) {
            token.control();
            globalThis.canvas.animatePan({
               x: token.document.object.center.x,
               y: token.document.object.center.y,
               scale: 1,
            });
         }
         return;
      }
      if (dataItem.type == "File" || dataItem.type == "Text") {
         return;
      }
      if (dataItem.source.toChat) {
         dataItem.source.toChat();
      } else if (dataItem.source.use) {
         if (dataItem.source.actor) {
            dataItem.source.use();
         } else {
            notify.error("You cannot use unowned items.");
         }
      } else {
         dataItem.source.sheet.render(true);
      }
   }

   async function dropHandler(event) {
      const data = TextEditor.getDragEventData(event);
      logger.info(data);
      let w,
         h = 1;
      let entity;
      if (data.type == "Tile") {
         data.documentName = "File";
         entity = data;
         if (entities.find((e) => e.id == data.id)) return;
      } else if (data.type == "ActiveEffect") {
         entity = game.dfreds?.effects?.all.find((e) => e._id == data.data.id);
         entity.documentName = "ActiveEffect";
         entity.id = entity._id;
         if (entities.find((e) => e?.id == data?.id)) return;
      } else if (data.uuid) {
         if (entities.find((e) => e.uuid == data.uuid)) return;
         entity = await fromUuid(data.uuid);

         if (data.type == "JournalEntry" || data.type == "Scene") {
            w = 4;
         }
      }
      if (!entity) {
         logger.error("Drop item is unknown", data);
         return;
      }
      logger.info(entity);
      entities = [...entities, entity];
      addItem(
         entity,
         Math.round(event.offsetX / (rowHeight + gap)) - 1,
         Math.round(event.offsetY / (rowHeight + gap)),
         w,
         h
      );
      serializeItems();
   }

   function addItem(item, x = 0, y = 0, w = 1, h = hm) {
      if (!item) return;
      const i = gridHelp.item({
         w,
         h,
         x,
         y,
         draggable: !locked,
         resizable: !locked,
      });
      let newItem = {
         [COLS]: i,
         id: item.id,
         uuid: item.uuid,
         source: item,
         type: item.documentName ?? item.type,
         persist: item.persist,
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
      entities = [];
      items = [];
      serializeItems(true);
   }

   function removeItem(dataItem) {
      items = items.filter((i) => i.id != dataItem.id);
      entities = entities.filter((e) => e.id != dataItem.source.id);
      serializeItems(true);
   }

   function addLayout() {
      serializeItems();
      items = [];
      layoutId = uuidv4();
      layoutName = `Grid #${$gridLayout.length}`;
      gridLayout.update((gl) => {
         gl.push({ layout: [], name: layoutName, layoutId });
         return gl;
      });
   }

   function editWidget() {
      const dialogClass = CreateApplication({
         moduleId,
         app_id: "edit-widget",
         title: "Edit widget",
         component: EditWidgetDialog,
         height: 600,
         width: 600,
         temp: true,
      });
      const dialog = new dialogClass();
      dialog.start();
      dialog.show();
   }

   async function removeGrid() {
      logger.info(layoutId);
      gridLayout.update((gl) => {
         gl = gl.filter((l) => l.layoutId != layoutId);
         layoutId = gl[0]?.layoutId;
         locked = true;
         return gl;
      });
      logger.info(layoutId);
      items = await deserializeItems();
   }

   function mouseUp(e, dataItem) {
      if (!locked) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.button == 0) {
         return itemClick(e, dataItem);
      }
      if (e.button == 1) {
         return itemMidClick(e, dataItem);
      }
      if (e.button == 2) {
         return itemRightClick(e, dataItem);
      }
   }

   function itemRightClick(e, dataItem) {
      dataItem.source.sheet.render(true);
   }

   function itemMidClick(e, dataItem) {
      if (dataItem.type == "Actor") {
         const token = canvas.tokens.placeables.find((t) => t.actor?.id == dataItem.source?.id);
         logger.info(token);
         if (token) {
            token.setTarget(game.user, { releaseOthers: !e.shiftKey });
         }
      }
   }
</script>

<AlphaShell bind:elementRoot id="grid" trackSize={true}>
   <div class="ui-flex ui-flex-col" style="background-color: hsl(var(--b2))">
      <div class="ui-p-1 ui-w-full ui-h-fit ui-flex ui-flex-row ui-items-center ui-gap-2">
         <IconButton
            title={locked ? `Edit grid` : `Lock grid`}
            icon={locked ? "material-symbols:edit-square" : "material-symbols:lock"}
            on:click={toggleEdit}
            size="xs"
         />

         <div
            style="background: unset"
            class="ui-justify-center ui-w-full ui-tabs ui-tabs-boxed ui-flex ui-items-center ui-h-full "
         >
            <div
               class="ui-flex ui-flex-1 ui-flex-row ui-w-full ui-h-full ui-justify-center ui-items-center ui-flex-wrap ui-gap-2"
            >
               {#each $gridLayout as l (l.layoutId)}
                  <a
                     on:click={async (_) => {
                        if (!locked) {
                           notify.info("Lock the grid before switching.");
                           return;
                        }
                        layoutId = l.layoutId;
                        items = await deserializeItems();
                     }}
                     class="ui-tab ui-tab-xs ui-text-base-content ui-h-full"
                     class:ui-tab-active={l.layoutId == layoutId}
                  >
                     {l.name}
                  </a>
               {/each}
               <InlineButton
                  disabled={!isPremium()}
                  title={isPremium() ? "Add grid" : "Grid adding is Patreon-only feature"}
                  on:click={addLayout}
                  icon="material-symbols:add-circle-rounded"
                  size="xs"
               />
            </div>
         </div>
      </div>
      {#if !locked}
         <div class="ui-p-1 ui-w-full ui-h-fit ui-flex ui-flex-row ui-items-center ui-gap-2">
            <div class="ui-flex-1 ui-w-full ui-h-fit ui-flex ui-flex-row ui-items-center ui-gap-2">
               <ArgInput
                  size="xs"
                  label="Name"
                  type="string"
                  bind:value={layoutName}
                  on:change={(_) => {
                     serializeItems();
                  }}
               />
               <!-- <ArgInput -->
               <!--    size="xs" -->
               <!--    label="Row height" -->
               <!--    type="int" -->
               <!--    bind:value={rowHeight} -->
               <!--    on:change={async (_) => { -->
               <!--       serializeItems(); -->
               <!--       items = await deserializeItems(); -->
               <!--    }} -->
               <!-- /> -->

               <IconButton title="Reset layout" icon="gg:arrow-top-left-r" on:click={updateItems} size="xs" />
            </div>
            <div class="ui-flex-none">
               <IconButton title="Remove all items" icon="icon-park-solid:clear-format" on:click={reset} size="xs" />
               {#if isPremium()}
                  <RemoveButton title="Delete grid" disabled={$gridLayout.length <= 1} on:click={removeGrid} size="xs" />
               {/if}
            </div>
         </div>
      {/if}
   </div>
   <div id={layoutId} class="ui-h-full ui-w-full" style="background-color: hsv(var(--b1))" on:drop={dropHandler}>
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
            class="grid-item ui-h-full ui-w-full ui-rounded-md ui-flex ui-items-center ui-justify-center"
            style="background-color: hsl(var(--b2))"
            class:editable={!locked}
            class:ui-cursor-pointer={locked}
            on:mouseup={(e) => mouseUp(e, dataItem)}
            id={dataItem.id}
            data-type={dataItem.type}
         >
            {#if dataItem.type == "Item"}
               <ItemThumb maximize={true} item={dataItem.source} />
            {:else if dataItem.type == "ActiveEffect"}
               <ActiveEffectThumb draggable={false} maximize={true} item={dataItem.source} />
            {:else if dataItem.type == "File"}
               <FileThumb zoom={false} maximize={true} file={dataItem.source} />
            {:else if dataItem.type == "Text"}
               <div class="ui-p-1">
                  <TJSProseMirror content={dataItem.source.text} options={{ editable: false }} />
               </div>
            {:else if dataItem.type == "JournalEntry"}
               <div class="ui-p-1 ui-font-bold ui-link">
                  {dataItem.source.name}
               </div>
            {:else if dataItem.type == "Scene"}
               <div
                  class="ui-text-shadow-lg ui-flex ui-items-center ui-justify-center ui-rounded-md ui-font-bold ui-link ui-bg-cover ui-w-full ui-h-full"
                  style:background-image={`url(${dataItem.source.thumb})`}
                  style:color="#eee"
               >
                  {dataItem.source.name}
               </div>
            {:else if dataItem.type == "Actor"}
               <DocumentThumb
                  title={`${dataItem.source.data.name} [select | target | open]`}
                  maximize={true}
                  item={writable(dataItem.source)}
               />
            {:else}
               <DocumentThumb maximize={true} item={writable(dataItem.source)} />
            {/if}

            {#if !locked}
               <div class="remove">
                  <RemoveButton size="xs" on:click={(_) => removeItem(dataItem)} title="Remove item" />
               </div>
            {/if}
         </div>
      </Grid>

      {#if items.length == 0}
         <div class="overlay">
            {#if game.user.isGM}
               <span>Drop <b>Item / Actor / File / Macros / Scene</b> here</span>
            {:else}
               <span>Drop <b>Item / Macros</b> here</span>
            {/if}
            <div class="ui-divider">OR</div>
            <button
               disabled={true}
               style="pointer-events: all !important"
               class="ui-btn ui-btn-md ui-btn-primary ui-w-48 ui-btn-disabled"
               on:click={editWidget}>Add widget<br />[coming soon...]</button
            >
         </div>
      {/if}
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
   .overlay {
      /* background: rebeccapurple; */
      height: 100%;
      width: 100%;
      position: fixed;
      top: 30px;
      /* opacity: 50%; */
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 4rem;
      pointer-events: none;
   }
   .editable {
      border: 1px indianred solid;
   }
   .remove {
      cursor: pointer;
      position: absolute;
      right: -30px;
      top: 0px;
   }
   :global(.svlt-grid-item:hover) {
      z-index: 10;
   }
</style>
