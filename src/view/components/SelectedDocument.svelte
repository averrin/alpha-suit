<script>
   import { logger, getFlag, setFlag, hasFlag } from "crew-components/helpers";
   import Tags from "crew-components/Tags";
   import ArgInput from "crew-components/ArgInput";
   import DocumentThumb from "./DocumentThumb.svelte";
   import CopyToClipboard from "svelte-copy-to-clipboard";

   export let item;
   import { selected } from "../../modules/stores.js";

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
   let tags = getFlag($item, "tagger")?.tags || [];

   async function setTags(e) {
      await setFlag($item, "tagger", e.detail);
      item.set($item);
      tags = getFlag($item, "tagger")?.tags;
   }
   $: tags = getFlag($item, "tagger")?.tags || [];

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
</script>

<div class="ui-flex ui-flex-col ui-gap-3" id={$item.id}>
   <div class="ui-flex ui-flex-row ui-gap-3 ui-items-center">
      {#if $item.thumbnail}
         <div class="ui-h-12 ui-w-12">
            <DocumentThumb item={$item} on:click={() => $item.sheet.render(true)} />
         </div>
      {:else}
         <iconify-icon icon="fa-solid:folder" class="ui-ml-2 ui-text-lg" />
      {/if}

      <div class="ui-flex ui-flex-row ui-flex-1">
         <div class="ui-input-group">
            <span>Name</span>
            <input type="text" class="ui-input-lg" value={$item.name} on:change={(e) => update(e, "name")} />
         </div>
      </div>

      <div class="ui-flex ui-flex-row ui-flex-none">
         <div class="ui-btn-group">
            <button class="ui-btn ui-btn-square" on:click={clone}>
               <iconify-icon icon="fa-solid:clone" class="ui-text-lg" />
            </button>

            {#if !$item.thumbnail}
               <ArgInput type="color" value={$item.data.color} compact={true} inline={true} on:change={changeColor} />
            {/if}

            <button class="ui-btn ui-btn-square ui-btn-error" on:click={remove}>
               <iconify-icon icon="gridicons:cross" class="ui-text-xl" />
            </button>
         </div>
      </div>
   </div>
   <div class="ui-flex ui-flex-row ui-gap-1/2">
      <button class="ui-btn ui-btn-square ui-btn-xs" title="Permissions">
         <iconify-icon icon="fa:share-alt" class="ui-text-lg" on:click={changePermissions} />
      </button>
      <CopyToClipboard
         text={$item.data.name}
         on:copy={(_) => globalThis.ui.notifications.info("Name copied!")}
         let:copy
      >
         <button class="ui-btn ui-btn-square ui-btn-xs" title="Copy name" on:click={copy}>
            <iconify-icon icon="icon-park-solid:edit-name" class="ui-text-lg" />
         </button>
      </CopyToClipboard>
      <CopyToClipboard text={$item.id} on:copy={(_) => globalThis.ui.notifications.info("ID copied!")} let:copy>
         <button class="ui-btn ui-btn-square ui-btn-xs" title="Copy ID" on:click={copy}>
            <iconify-icon icon="fluent-emoji-high-contrast:id-button" class="ui-text-lg" />
         </button>
      </CopyToClipboard>
      {#if $item.thumbnail}
         <CopyToClipboard
            text={$item.data.img}
            on:copy={(_) => globalThis.ui.notifications.info("Token path copied!")}
            let:copy
         >
            <button class="ui-btn ui-btn-square ui-btn-xs" title="Copy token path" on:click={copy}>
               <iconify-icon icon="fa:user-circle" class="ui-text-lg" />
            </button>
         </CopyToClipboard>
         <CopyToClipboard
            text={$item.data.img || $item.data.prototypeToken.texture.src}
            on:copy={(_) => globalThis.ui.notifications.info("Portrait path copied!")}
            let:copy
         >
            <button class="ui-btn ui-btn-square ui-btn-xs" title="Copy portrait path" on:click={copy}>
               <iconify-icon icon="fa:image" class="ui-text-lg" />
            </button>
         </CopyToClipboard>
      {/if}
   </div>
   <div class="ui-flex ui-flex-row ui-gap-3">
      <div class="ui-input-group">
         <span>Tags</span>
         <Tags {tags} on:tags={setTags} allowPaste={true} allowDrop={true} onlyUnique={true} />
      </div>
   </div>
</div>
