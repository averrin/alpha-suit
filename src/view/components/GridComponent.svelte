<svelte:options accessors={true} />

<script>
   import ActionGridWidget from "./ActionGridWidget.svelte";
   import { theme } from "crew-components/stores";
   import Icon from "crew-components/Icon";
   import { v4 as uuidv4 } from "uuid";
   import IconButton from "crew-components/IconButton";
   import InlineButton from "crew-components/InlineButton";
   import ItemThumb from "./ItemThumb.svelte";
   import DocumentThumb from "./DocumentThumb.svelte";
   import ActiveEffectThumb from "./ActiveEffectThumb.svelte";
   import RemoveButton from "crew-components/RemoveButton";
   import ArgInput from "crew-components/ArgInput";
   import { gridLayout, gridSizes, lastEditGrid } from "../../modules/stores.js";
   import { getContext, onDestroy, tick } from "svelte";
   const { application } = getContext("external");
   const position = application.position;
   const { width, height, top, left } = position.stores;
   import { writable } from "svelte/store";
   import { editingWidget } from "../../modules/stores.js";
   import exportFromJSON from "export-from-json";

   export let elementRoot;
   export let id;

   import TextGridWidget from "./TextGridWidget.svelte";
   import Grid from "svelte-grid";
   import gridHelp from "svelte-grid/build/helper/index.mjs";
   import FileThumb from "./FileThumb.svelte";
   import { notify } from "../../modules/notify";
   import { isPremium } from "crew-components/premium";
   import { SETTINGS, setting } from "crew-components/helpers";
   const widgetsEnabled = setting(SETTINGS.DEV_FEATURES);

   async function setVideoThumb(effect) {
      const els = document.querySelectorAll(`img#et-${effect.id ?? effect.effect.id}`);
      for (const el of els) {
         if (el) {
            try {
               let f = effect.effect.file;
               const entry = Sequencer.Database.getEntry(effect.effect.file);
               if (entry) {
                  f = entry.file;
                  if (typeof f === "object") {
                     f = f[Object.keys(f)[0]];
                  }
               }
               const thumb = await game.video.createThumbnail(f, {
                  height: 100,
                  width: 100,
               });
               el.setAttribute("src", thumb);
            } catch (error) {
               logger.error(error);
            }
         }
      }
   }

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

   const u = async (l) => {
      if (!locked) return;
      items = await deserializeItems(l);
      resizeItems();
   };
   onDestroy(gridLayout.subscribe(foundry.utils.debounce(u, 1000)));
   tick().then(u);

   let locked = true;

   function _resizeItems() {
      const old_items = [...items];
      items = [];
      for (const item of old_items) {
         if (!item || Object.keys(item).length == 0) continue;
         let oc = $gridSizes[$lastEditGrid] ?? Object.keys(item)[0];
         if (!item[oc]) {
            oc = Object.keys(item)[0];
         }
         let pos = item[oc] ?? { x: 0, y: 0, w: 1, h: 1 };
         let x = pos.x;
         let y = pos.y;
         if (x > COLS - 1 || y > ROWS - 1) {
            x = 0;
            y = 0;
         }
         const w = pos.w;
         const h = pos.h;
         addItem(item.source ?? item, x, y, w, h);
      }
      serializeItems();
   }
   const resizeItems = foundry.utils.debounce(_resizeItems, 50);

   async function deserializeItems(gl) {
      gl = gl ?? $gridLayout;
      entities = [];
      const l = gl.find((l) => l.layoutId == layoutId);
      let layout = l?.layout ?? [];
      layoutId = l?.layoutId ?? layoutId;
      layoutName = l?.name ?? layoutName;
      rowHeight = l?.options?.rowHeight ?? rowHeight;

      for (const i of layout) {
         let source;
         if (i.uuid) {
            source = await fromUuid(i.uuid);
         } else if (i.type == "Action") {
            source = game.actors.get(i.persist.actorId).system.actions.find((a) => a.item.id == i.persist.itemId);
            source.persist = i.persist;
            source.type = "Action";
         } else if (i.type == "CompendiumEntry") {
            source = game.packs.get(i.persist);
            source.persist = i.persist;
         } else if (i.type == "Text") {
            source = {
               ...i.persist,
               ...i,
            };
         } else if (i.type == "Effect") {
            source = {
               ...i.persist,
               ...i,
            };
         } else if (i.type == "File") {
            source = {
               name: i.sourceId.split("/")[i.id.split("/").length - 1],
               ...i,
            };
         } else if (i.type == "ActiveEffect") {
            source = game.dfreds?.effects?.all.find((e) => e._id == i.sourceId);
            source.type = "ActiveEffect";
            source.id = i.sourceId;
         } else {
            continue;
         }
         if (!source) {
            continue;
         }
         i.source = source;
         source.widgetId = i.widgetId;
         entities.push(source);
      }
      return Array.from(new Set(layout.filter((i) => i.source)));
   }

   function serializeLayout() {
      let layout = items.map((i) => {
         return { ...i };
      });
      for (const i of layout) {
         delete i.source;
      }
      const l = { layoutId, layout, name: layoutName };
      if (!l.options) {
         l.options = {};
      }
      l.options.rowHeight = rowHeight;
      return l;
   }

   function serializeItems(force = false) {
      if (items.length == 0 && !force) return;
      let layout = items.map((i) => {
         return { ...i };
      });
      for (const i of layout) {
         delete i.source;
      }
      const ll = $gridLayout.find((l) => l.layoutId == layoutId);
      if (ll) {
         const ol = JSON.parse(JSON.stringify(ll)).layout;
         if (ol) {
            ol.forEach((l) => {
               delete l.source;
            });
            if (JSON.stringify(layout) == JSON.stringify(ol) && ll.name == layoutName) {
               return;
            }
         }
      }
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
         for (const ll of gl) {
            ll.layout.forEach((i) => {
               delete i.source;
            });
         }
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
            gridSizes.update((s) => {
               s[id] = COLS;
               return s;
            });
            cols = [[1200, COLS]];
            resizeItems();
         });
      }),
      height.subscribe((h) => {
         tick().then((_) => {
            ROWS = h / (rowHeight * hm);
            resizeItems();
         });
      })
   );

   async function itemClick(e, dataItem) {
      if (dataItem.type == "CompendiumEntry") {
         dataItem.source.apps[0]?.render(true);
         return;
      }
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
      if (dataItem.type == "Effect") {
         notify.error("Editing is not available yet.");
         return;
      }
      if (dataItem.type == "Actor") {
         // dataItem.source.sheet.render(true);
         const token = canvas.tokens.placeables.find((t) => t.actor?.id == dataItem.source?.id);
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
         dataItem.source.sheet?.render(true);
      }
   }

   async function dropHandler(event) {
      if (event.dataTransfer.items[0].kind == "file") {
         const file = event.dataTransfer.items[0].getAsFile();
         logger.info("file import");
         file.text().then((content) => {
            const parsed = JSON.parse(content);
            if (!parsed || !parsed.layout) {
               logger.error("Grid import is corrupted.");
            }
            gridLayout.update((gl) => {
               const l = gl.find((l) => l.layoutId == layoutId);
               l.layout = parsed.layout;
               l.name = parsed.name;
               return gl;
            });
            tick().then(async (_) => {
               items = await deserializeItems();
            });
         });
         return;
      }
      const data = TextEditor.getDragEventData(event);
      // TODO: replace on drop
      let entity;
      if (data.type == "Tile") {
         data.documentName = "File";
         entity = data;
         if (entities.find((e) => e.id == data.id)) return;
      } else if (data.type == "Action") {
         data.documentName = "Action";
         entity = game.actors.get(data.actorId).system.actions[data.index];
         entity.type = "Action";
         entity.persist = { ...data, itemId: entity.item.id };
         entity.h = 2;
         entity.w = 6;
      } else if (data.type == "CompendiumEntry") {
         data.documentName = "CompendiumEntry";
         entity = game.packs.get(data.id);
         entity.persist = data.id;
         // logger.error(entity);
         entity.w = 4;
         if (entities.find((e) => e?.id == data?.id)) return;
      } else if (data.type == "Effect") {
         data.documentName = "Effect";
         entity = data;
         entity.persist = { effect: entity.effect, section: entity.section };
         entity.w = 4;
         if (entities.find((e) => e.section?.id == data.section?.id)) return;
         setTimeout((_) => setVideoThumb(entity), 100);
      } else if (data.type == "ActiveEffect") {
         // TODO: custom effects
         entity = game.dfreds?.effects?.all.find((e) => e._id == data.data.id);
         entity.documentName = "ActiveEffect";
         entity.id = entity._id;
         if (entities.find((e) => e?.id == data?.id)) return;
      } else if (data.uuid) {
         if (entities.find((e) => e.uuid == data.uuid)) return;
         entity = await fromUuid(data.uuid);

         if (data.type == "JournalEntry" || data.type == "Scene") {
            entity.w = 4;
         }
      }
      if (!entity) {
         logger.error("Drop item is unknown", data);
         return;
      }
      addEntity(entity, event);
   }

   function addEntity(entity, event) {
      if (!entity) {
         return;
      }

      if (entity.uuid?.startsWith("Folder")) {
         entities = [...entities, ...entity.contents];
         for (const e of entity.contents) {
            addEntity(e);
         }
         for (const child of entity.children) {
            addEntity(child.folder);
         }
      } else {
         entities = [...entities, entity];
         addItem(
            entity,
            event ? Math.round(event.offsetX / (rowHeight + gap)) - 1 : 0,
            event ? Math.round(event.offsetY / (rowHeight + gap)) : 0,
            entity.w ?? 1,
            entity.h ?? 1
         );
      }
      serializeItems();
   }

   function addItem(item, x = 0, y = 0, w = 1, h = hm) {
      if (!item) return;
      let type = item.documentName ?? item.type;
      if (item instanceof CompendiumCollection) {
         type = "CompendiumEntry";
      }
      const i = gridHelp.item({
         w,
         h,
         x,
         y,
         draggable: !locked,
         resizable: !locked,
      });
      const widgetId = item.widgetId ?? uuidv4();
      let newItem = {
         widgetId,
         id: widgetId,
         sourceId: item.id ?? uuidv4(),
         uuid: item.uuid,
         source: item,
         type,
         persist: item.persist,
      };
      for (const g in $gridSizes) {
         newItem[$gridSizes[g]] = i;
      }

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
      serializeItems(true);
      // gridLayout.update((gl) => {
      //    gl.push({ layout: [], name: layoutName, layoutId });
      //    return gl;
      // });
   }

   function editWidget(widget) {
      editingWidget.set(widget);
      tick().then((_) => AlphaSuit.showApp("edit-widget"));
   }

   onDestroy(
      editingWidget.subscribe((w) => {
         if (!w) return;
         const item = items.find((i) => i.widgetId == w.widgetId);
         delete w.source;
         if (!item) {
            items = [...items, w];
         } else {
            items[items.indexOf(item)] = w;
            items = [...items];
         }
         serializeItems();
         resizeItems();
         Hooks.call("updateWidget");
      })
   );

   async function removeGrid() {
      gridLayout.update((gl) => {
         gl = gl.filter((l) => l.layoutId != layoutId);
         layoutId = gl[0]?.layoutId;
         locked = true;
         return gl;
      });
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
      dataItem.source.sheet?.render(true);
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

   function getEffectName(effect) {
      let name = effect.effect.file.split("/")[effect.effect.file.split("/").length - 1];
      if (effect.section?.args[0]) {
         name = effect.section?.args[0];
      } else if (effect.effect.name) {
         if (effect.effect.name != effect.effect.file) {
            name = `${effect.ffect.name} (${name})`;
         }
      } else {
      }
      return name;
   }

   function onDragStartEffect(event, effect) {
      let section = { ...effect.section };
      section.id = uuidv4();
      section.savedId = null;
      const dragData = {
         type: "Effect",
         effect: effect.effect,
         section,
         temp: event.ctrlKey,
         instant: event.altKey,
      };
      event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
   }

   function exportLayout() {
      const fileName = `grid-${layoutName}`;
      const exportType = exportFromJSON.types.json;
      exportFromJSON({ data: serializeLayout(), fileName, exportType });
   }

   tick().then((_) => Hooks.call("updateWidget"));
</script>

<div class="ui-flex ui-flex-col alpha-ui" data-theme={$theme} style="background-color: hsl(var(--b2))">
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
                     resizeItems();
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
      {#if id != "standalone"}
         <IconButton icon="material-symbols:open-in-browser" size="xs" on:click={(_) => AlphaSuit.showApp("grid")} />
      {/if}
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
                  foundry.utils.debounce(serializeItems, 500)();
               }}
            />

            <IconButton title="Reset layout" icon="gg:arrow-top-left-r" on:click={updateItems} size="xs" />

            {#if widgetsEnabled}
               <IconButton
                  icon="fa6-solid:plus"
                  title="Add new widget"
                  type="primary"
                  size="xs"
                  on:click={(_) => editWidget()}
               />
            {/if}
            <IconButton icon="ph:export-bold" title="Export layout" size="xs" on:click={exportLayout} />
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
      on:change={(_) => {
         if (id == lastEditGrid) return;
         lastEditGrid.set(id);
      }}
   >
      <div
         class="grid-item ui-h-full ui-w-full ui-rounded-md ui-flex ui-items-center ui-justify-center"
         style="background-color: hsl(var(--b2))"
         class:editable={!locked}
         class:ui-cursor-pointer={locked}
         on:mouseup={(e) => mouseUp(e, dataItem)}
         id={dataItem.widgetId}
         data-type={dataItem.type}
         style:border-width={dataItem?.source?.persist?.borderWidth}
         style:border-color={dataItem?.source?.persist?.borderColor}
         style:border-style={dataItem?.source?.persist?.borderColor ? "solid" : "none"}
      >
         {#if dataItem.type == "Item"}
            <ItemThumb autoHighlight={false} maximize={true} item={dataItem.source} />
         {:else if dataItem.type == "ActiveEffect"}
            <ActiveEffectThumb draggable={false} maximize={true} item={dataItem.source} />
         {:else if dataItem.type == "File"}
            <FileThumb zoom={false} maximize={true} file={dataItem.source} />
         {:else if dataItem.type == "Text"}
            <TextGridWidget item={writable(dataItem.source)} />
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
         {:else if dataItem.type == "Effect"}
            <div
               class="ui-flex ui-flex-1 ui-flex-row ui-gap-2 ui-items-center ui-justify-center"
               draggable="true"
               on:dragstart={(e) => onDragStartEffect(e, dataItem.source)}
            >
               <img
                  id={`et-${dataItem.source.effect.id}`}
                  src="icons/svg/video.svg"
                  alt=""
                  class="ui-rounded-md ui-h-6 ui-border-none"
               />
               {@html getEffectName(dataItem.source)}

               {#if dataItem.source.section?.lightConfig}
                  <Icon icon="fa6-solid:lightbulb" />
               {/if}
            </div>
         {:else if dataItem.type == "CompendiumEntry"}
            <div class="ui-flex ui-flex-row ui-gap-2 ui-items-center">
               <Icon icon="fa-solid:atlas" />
               {dataItem.source.metadata.label}
            </div>
         {:else if dataItem.type == "Action"}
            <ActionGridWidget action={dataItem.source} />
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
            {#if dataItem.type == "Text"}
               <div class="edit">
                  <IconButton
                     icon="material-symbols:edit-square"
                     size="xs"
                     on:click={(_) => editWidget(dataItem)}
                     title="Remove item"
                  />
               </div>
            {/if}
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
         {#if widgetsEnabled}
            <button
               style="pointer-events: all !important"
               class="ui-btn ui-btn-md ui-btn-primary ui-w-48"
               on:click={(_) => editWidget()}>Add widget</button
            >
         {:else}
            <button class="ui-btn ui-btn-md ui-btn-primary ui-w-48 ui-btn-disabled"
               >Add widget<br />[coming soon]</button
            >
         {/if}
      </div>
   {/if}
</div>


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
      border: 1px indianred solid !important;
   }
   .remove {
      cursor: pointer;
      position: absolute;
      right: -30px;
      top: 0px;
   }
   .edit {
      cursor: pointer;
      position: absolute;
      right: -30px;
      top: 30px;
   }
   :global(.svlt-grid-item:hover) {
      z-index: 10;
   }
</style>
