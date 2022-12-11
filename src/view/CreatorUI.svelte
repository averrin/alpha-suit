<svelte:options accessors={true} />

<script>
   import DocumentThumb from "./components/DocumentThumb.svelte";
   import { writable } from "svelte/store";
   import AlphaShell from "crew-components/AlphaShell";
   import { capitalize } from "crew-components/helpers";
   import ArgInput from "crew-components/ArgInput";
   import { TJSProseMirror } from "@typhonjs-fvtt/svelte-standard/component";
   export let elementRoot;

   let createdDocuments = [];
   const defaultName = "New Item";

   const types = [
      { name: "Item", type: "Item" },
      // { name: "Actor", type: "Actor" },
   ];
   let documentType = types[0].type;
   const subtypes = {
      Item: [
         { name: "Loot", type: "loot" },
         { name: "Consumable", type: "consumable" },
         { name: "Equipment", type: "equipment" },
         { name: "Weapon", type: "weapon" },
         { name: "Tool", type: "tool" },
      ],
      Actor: [
         { name: "Character", type: "Character" },
         { name: "NPC", type: "NPC" },
      ],
   };
   let documentSubtype = subtypes[documentType][0].type;
   const defaultItem = {
      img: "icons/svg/item-bag.svg",
      name: defaultName,
      system: {
         price: 0,
         weight: 0,
         description: {
            value: "",
         },
         rarity: "common",
      },
   };
   let item = JSON.parse(JSON.stringify(defaultItem));

   async function dropHandler(event) {
      const data = TextEditor.getDragEventData(event);
      if (data.type == "Tile") {
         item.img = data.texture.src;
         if (item.name == defaultName) {
            const t = data.texture.src.split("/");
            let n = t[t.length - 1].split(".").slice(0, -1).join(".").replaceAll(new RegExp(/[-_]/g), " ");
            n = n
               .split(" ")
               .map((w) => capitalize(w))
               .join(" ");
            item.name = n;
         }
         item = { ...item };
      }
   }
   let moveTo;
   function clear() {
      item = JSON.parse(JSON.stringify(defaultItem));
   }
   async function create() {
      item.type = documentSubtype;
      logger.info(moveTo);
      const newItem = await Item.create([item], { folder: moveTo });
      await Item.updateDocuments(
         newItem.map((i) => {
            return { folder: moveTo, _id: i.id };
         })
      );
      logger.info(newItem, moveTo);
      item.name = defaultName;
      createdDocuments = [...createdDocuments, ...newItem];
   }

   function docClick(e, doc) {
      logger.info(e);
      if (e.button == 2) {
         doc.sheet.render(true);
      }
   }
</script>

<AlphaShell bind:elementRoot id="creator" trackSize={true}>
   <div class="ui-flex ui-flex-col ui-w-full ui-h-full ui-gap-2 ui-p-2">
      <div class="ui-w-full ui-flex ui-items-center">
         <div
            style="background: unset"
            class="ui-justify-center ui-w-full ui-h-8 ui-tabs ui-tabs-boxed ui-flex ui-items-center"
         >
            <div
               class="ui-flex ui-flex-1 ui-flex-row ui-w-full ui-h-full ui-justify-center ui-items-center ui-flex-wrap ui-gap-2"
            >
               {#each types as l (l.type)}
                  <a
                     class="ui-tab ui-tab-xs ui-text-base-content ui-h-full"
                     class:ui-tab-active={l.type == documentType}
                     on:click={(_) => {
                        documentType = l.type;
                        documentSubtype = subtypes[documentType][0].type;
                     }}
                  >
                     {l.name}
                  </a>
               {/each}
            </div>
         </div>

         <div
            style="background: unset"
            class="ui-justify-center ui-w-full ui-h-8 ui-tabs ui-tabs-boxed ui-flex ui-items-center ui-h-full "
         >
            <div
               class="ui-flex ui-flex-1 ui-flex-row ui-w-full ui-h-full ui-justify-center ui-items-center ui-flex-wrap ui-gap-2"
            >
               {#each subtypes[documentType] as l (l.type)}
                  <a
                     class="ui-tab ui-tab-xs ui-text-base-content ui-h-full"
                     class:ui-tab-active={l.type == documentSubtype}
                     on:click={(_) => {
                        documentSubtype = l.type;
                     }}
                  >
                     {l.name}
                  </a>
               {/each}
            </div>
         </div>
      </div>

      <div class="ui-flex ui-flex-row ui-w-full ui-h-full ui-gap-2 ui-p-2">
         <div class="ui-flex ui-flex-col ui-h-full ui-gap-2">
            <img
               on:drop={dropHandler}
               src={item.img}
               style="border: none; height: 240px; max-width: 240px;"
               class="ui-rounded-md"
            />
            <div class="ui-flex ui-flex-col ui-w-full ui-gap-2">
               <ArgInput type="float" label="Price" bind:value={item.system.price} clearable={true} size="md" />
               <ArgInput type="float" label="Weight" bind:value={item.system.weight} clearable={true} size="md" />
               <ArgInput
                  type="select"
                  label="Rarity"
                  spec={{
                     control: "select",
                     options: [
                        { value: ``, label: "" }, // TODO: add empty option automatically
                        { value: `common`, label: "Common" },
                        { value: `uncommon`, label: "Uncommon" },
                        { value: `rare`, label: "Rare" },
                        { value: `veryRare`, label: "Very Rare" },
                        { value: `legendary`, label: "Legendary" },
                     ],
                  }}
                  size="md"
                  bind:value={item.system.rarity}
                  on:change={(e) => (item.system.rarit = e.detail.value)}
               />
            </div>
         </div>
         <div class="ui-flex ui-flex-col ui-w-full ui-h-full ui-gap-2">
            <ArgInput type="string" label="Name" bind:value={item.name} clearable={true} size="md" />
            <div class="ui-h-full ui-w-full ui-rounded-md ui-p-2" style="background-color: hsl(var(--b3))">
               <TJSProseMirror
                  on:editor:save={(e) => {
                     item.system.description.value = e.detail.content;
                     item = { ...item };
                  }}
                  bind:content={item.system.description.value}
                  options={{ editable: true, saveOnBlur: true }}
               />
            </div>
         </div>
      </div>

      <div class="ui-flex ui-flex-row ui-w-full ui-gap-2">
         <ArgInput
            type="select"
            label="Folder"
            spec={{
               control: "select",
               options: [
                  { value: null, label: "Root" },
                  ...game.folders
                     .filter((f) => f.type == documentType)
                     .map((n) => {
                        return { value: n.id, label: n.name || "Root" };
                     }),
               ],
            }}
            size="md"
            bind:value={moveTo}
            on:change={(e) => (moveTo = e.detail)}
         />
         <div class="ui-flex ui-flex-row ui-w-full ui-gap-2">
            {#each createdDocuments as doc (doc.id)}
               <div class="ui-w-10 ui-h-10" on:mouseup={(e) => docClick(e, doc)}>
                  <DocumentThumb maximize={true} item={writable(doc)} />
               </div>
            {/each}
         </div>
      </div>
      <div class="ui-flex ui-flex-row ui-items-center ui-justify-center ui-gap-2 ui-p-2">
         <button class="ui-btn ui-btn-md" style:width="32%" on:click={clear}>Clear</button>
         <button class="ui-btn ui-btn-md" style:width="32%" on:click={create}>Create and keep</button>
         <button
            class="ui-btn ui-btn-md"
            style:width="32%"
            on:click={(_) => {
               create();
               clear();
            }}>Create and clear</button
         >
      </div>
   </div>
</AlphaShell>
