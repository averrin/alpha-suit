<script>
   import { logger, getFlag, setFlag, hasFlag, toggleFlag } from "crew-components/helpers";
   import Tags from "crew-components/Tags";
   import ArgInput from "crew-components/ArgInput";
   import CopyButton from "crew-components/CopyButton";
   import IconButton from "crew-components/IconButton";
   import RemoveButton from "crew-components/RemoveButton";
   import DocumentThumb from "./DocumentThumb.svelte";
   import { treeItems, moveItemToFolder } from "../../modules/stores.js";

   import Permissions from "./Permissions.svelte";
   import { onDestroy } from "svelte";

   export let item;
   let isFolder;

   import { selected, currentCollection } from "../../modules/stores.js";
   import InspectButton from "./InspectButton.svelte";
   let isFav;
   let tags = getFlag($item, "tagger")?.tags || [];

   function onUpdate(i) {
      isFav = getFlag(i, "alpha-suit.fav");
      tags = getFlag(i, "tagger")?.tags || [];
      isFolder = i instanceof Folder || i?.depth;
   }

   onDestroy(item.subscribe(onUpdate));

   const unsub = Hooks.on("updateActor", onUpdate);
   onDestroy((_) => Hooks.off("updateActor", unsub));
   const unsub1 = Hooks.on("updateItem", onUpdate);
   onDestroy((_) => Hooks.off("updateItem", unsub1));
   // setPortraitImg
   async function setPortraitImg() {
      const data = await navigator.clipboard.read();
      let path = data.find((i) => i.types.includes("text/plain"))?.getType("text/plain");
      if (path) {
         path = await (await path).text();
         if ($item.data.img) {
            $item.update({ img: path });
         }
         item.set($item);
         Hooks.call("updateActor", $item);
         Hooks.call("updateItem", $item);
         // $item.data.img || $item.data.prototypeToken.texture.src
      }
   }

   async function setTokenImg() {
      const data = await navigator.clipboard.read();
      let path = data.find((i) => i.types.includes("text/plain"))?.getType("text/plain");
      if (path) {
         path = await (await path).text();
         if ($item.data.token?.img) {
            $item.update({ "token.img": path });
         } else if ($item.data.prototypeToken.texture.src) {
            $item.update({ "prototypeToken.texture.src": path });
         }
         item.set($item);
         Hooks.call("updateActor", $item);
         // $item.data.img || $item.data.prototypeToken.texture.src
      }
   }

   async function update(e, path) {
      const updates = { _id: $item.id };
      updates[path] = e.target.value;
      await $item.update(updates);
      item.set($item);
   }

   function clone() {
      $item.clone({ name: `${$item.name} (Copy)` }, { save: true });
   }
   function remove() {
      $item.deleteDialog().then((r) => {
         if (r) {
            selected.set([]);
         }
      });
   }

   if (!hasFlag($item, "tagger")) setFlag($item, "tagger", { tags: [] });

   async function setTags(e) {
      await setFlag($item, "tagger", e.detail);
      item.set($item);
      tags = getFlag($item, "tagger")?.tags;
   }

   function changeColor(e) {
      $item.update({ color: e.detail });
      item.set($item);
   }

   function changePermissions() {
      new PermissionControl($item, {
         top: Math.min(0, window.innerHeight - 350),
         left: window.innerWidth - 720,
      }).render(true);
   }

   let moveTo;
</script>

<div class="ui-flex ui-flex-col ui-gap-2" id={$item.id}>
   <div class="ui-flex ui-flex-row ui-gap-3 ui-items-center">
      {#if $item.thumbnail}
         <div class="ui-h-12 ui-w-12">
            <DocumentThumb {item} on:click={() => $item.sheet.render(true)} />
         </div>
      {:else}
         <iconify-icon icon="fa-solid:folder" class="ui-ml-2 ui-text-lg" />
      {/if}

      <div class="ui-flex ui-flex-row ui-flex-1">
         <div class="ui-input-group ui-input-group-md">
            <span>Name</span>
            <input
               type="text"
               class="ui-input-lg ui-pl-2"
               style:border-color="hsl(var(--b3))"
               value={$item.name}
               on:change={(e) => update(e, "name")}
            />
         </div>
      </div>

      <div class="ui-flex ui-flex-row ui-flex-none">
         <div class="ui-btn-group ui-btn-group-md">
            <IconButton on:click={clone} icon="fa-solid:clone" size={"md"} type="primary" />
            {#if isFolder}
               <ArgInput type="color" value={$item.data.color} compact={true} inline={true} on:change={changeColor} />
            {/if}
            <RemoveButton on:click={remove} />
         </div>
      </div>
   </div>
   <div class="ui-flex ui-flex-row ui-gap-1 ui-items-center">
      <div class="ui-flex ui-flex-row ui-gap-1 ui-group ui-group-xs ui-w-full ui-flex-1 ui-items-center">
         <IconButton size="xs" title="Permissions" icon="fa:share-alt" on:click={changePermissions} type="primary" />
         <CopyButton
            text={$item.data.name}
            title={"Copy name: " + $item.data.name}
            notification={"Name copied!"}
            icon="icon-park-solid:edit-name"
         />
         <CopyButton
            text={$item.id}
            title={"Copy ID: " + $item.id}
            notification={"ID copied!"}
            icon="fluent-emoji-high-contrast:id-button"
         />
         {#if $item.thumbnail}
            <CopyButton
               text={$item.data.img}
               title={"Copy portrait path: " + $item.data.img}
               notification={"Portrait path copied!"}
               icon="fa-solid:image"
            />

            {#if $item.data.token || $item.data.prototypeToken}
               <CopyButton
                  text={$item.data.token.img || $item.data.prototypeToken.texture.src}
                  notification={"Token path copied!"}
                  title={"Copy token path: " + ($item.data.token.img || $item.data.prototypeToken.texture.src)}
                  icon="fa:user-circle"
               />
            {/if}

            <div class="ui-ml-2" />

            <IconButton
               size="xs"
               icon="fa:image"
               title="Set portrait img path from clipboard"
               on:click={setPortraitImg}
               type="primary"
            />

            {#if $item.data.token || $item.data.prototypeToken}
               <IconButton
                  size="xs"
                  icon="fa:user-circle-o"
                  title="Set token img path from clipboard"
                  on:click={setTokenImg}
                  type="primary"
               />
            {/if}
         {/if}
         <div class="ui-ml-2" />
         <IconButton
            size="xs"
            type="primary"
            icon={!isFav ? "fa-regular:star" : "fa-solid:star"}
            title="Toggle favorite"
            on:click={async (_) => {
               await toggleFlag($item, "alpha-suit.fav");
               item.set($item);
            }}
         />

         {#if !($item instanceof Scene) && game.modules.get("data-inspector")?.api}
            <InspectButton item={$item} />
         {/if}

         {#if $item?.data?.permission}
            <div class="ui-mx-2 ui-flex ui-items-center">
               <Permissions item={$item} />
            </div>
         {/if}
      </div>

      <div class="ui-flex ui-flex-row ui-gap-none ui-items-center">
         <ArgInput
            type="select"
            spec={{
               control: "select",
               options: Object.values($treeItems)
                  .filter((n) => n.source instanceof Folder || n.source?.depth || n.root)
                  .map((n) => {
                     return { value: n.id, label: n.name || "Root" };
                  }),
            }}
            size="xs"
            bind:value={moveTo}
         >
            <div
               class="ui-btn ui-btn-primary ui-btn-xs"
               slot="right"
               on:click={(_) => moveItemToFolder($item.id, moveTo)}
            >
               Move
            </div>
         </ArgInput>
      </div>
   </div>
   <div class="ui-flex ui-flex-row ui-gap-3">
      <div class="ui-input-group ui-input-group-md">
         <span>Tags</span>
         <Tags {tags} on:tags={setTags} allowPaste={true} allowDrop={true} onlyUnique={true} />
      </div>
   </div>
</div>
