<script>
   export let items;
   import SelectedDocument from "./SelectedDocument.svelte";
   import Tags from "crew-components/Tags";
   import ArgInput from "crew-components/ArgInput";
   import { treeItems, moveItemToFolder } from "../../modules/stores.js";
   import { getFlag, setFlag } from "crew-components/helpers";
   import { selected } from "../../modules/stores.js";
   import { onDestroy, tick } from "svelte";
   import { writable } from "svelte/store";

   function removeAll() {
      $items[0].deleteDialog().then((r) => {
         if (r) {
            let i = $items;
            i.shift();
            i.forEach((item) => item.delete());
            selected.set([]);
         }
      });
   }
   let tagsMutual;
   let tagsMutualOld;
   let tagsSelected;

   function addTags(item, tags) {
      let tagger = getFlag(item, "tagger");
      tagger.tags.push(...tags.filter((t) => !tagger.tags.includes(t)));
      setFlag(item, "tagger", tagger);
   }

   function removeTags(item, tags) {
      let tagger = getFlag(item, "tagger");
      tagger.tags = tagger.tags.filter((t) => !tags.includes(t));
      setFlag(item, "tagger", tagger);
   }

   function onMutualTags(event) {
      const tags = event.detail.tags.filter((t) => t.trim() != "");
      const add = tags.filter((t) => !tagsMutualOld.includes(t));
      const remove = tagsMutualOld.filter((t) => !tags.includes(t));
      if (add.length > 0) $items.forEach((item) => addTags(item, add));
      if (remove.length > 0) $items.forEach((item) => removeTags(item, remove));
      tagsMutualOld = [...tagsMutual];
      items.set($items);
   }

   function updateMutual() {
      tagsSelected = $items.map((t) => getFlag(t, "tagger")?.tags.filter((t) => t.trim() != ""));
      tagsMutual = [];
      for (let a of tagsSelected.filter((a) => a)) {
         for (let t of a) {
            if (!tagsMutual.includes(t) && tagsSelected.every((tags) => tags.includes(t))) tagsMutual.push(t);
         }
      }
      tagsMutualOld = [...tagsMutual];
   }

   const unsub = selected.subscribe(() => tick().then(updateMutual));
   onDestroy(unsub);

   const unsub1 = Hooks.on("updateActor", () => tick().then(updateMutual));
   onDestroy(() => Hooks.off("updateActor", unsub1));
   let count = $items.length;
   $: count = $items.length;
   let moveTo;

   function moveItems() {
      for (const item of $items) {
         moveItemToFolder(item.id, moveTo);
      }
   }
</script>

<div class="ui-flex ui-flex-col ui-flex-none ui-gap-2 ui-p-2">
   <div class="ui-flex ui-flex-row ui-gap-3 ui-justify-center ui-items-center">
      <div class="ui-flex ui-flex-row ui-flex-1 ui-text-lg ui-items-center ui-justify-start ui-w-full ui-px-1">
         Selected: {count}
      </div>

      <div class="ui-flex ui-flex-row ui-flex-none ui-gap-2 ui-items-center">
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
            size="md"
            bind:value={moveTo}
         >
            <div class="ui-btn ui-btn-primary ui-btn-md" slot="right" on:click={(_) => moveItems()}>Move</div>
         </ArgInput>

         <div class="ui-btn-group ui-btn-group-md">
            <button class="ui-btn ui-btn-square ui-btn-error" on:click={removeAll}>
               <iconify-icon icon="fluent:delete-20-filled" class="ui-text-xl" />
            </button>
         </div>
      </div>
   </div>

   <div class="ui-flex ui-flex-row ui-gap-3">
      <div class="ui-input-group ui-input-group-md">
         <span>Mutual</span>
         <Tags on:tags={onMutualTags} tags={tagsMutual} allowPaste={true} allowDrop={true} onlyUnique={true} />
      </div>
   </div>
</div>

<div class="ui-flex ui-flex-col ui-gap-2 ui-overflow-auto ui-flex-1 ui-p-2">
   {#each $items as item (item.id)}
      <div class="ui-divider ui-my-0 ui-h-2" />
      <SelectedDocument item={writable(item)} />
   {/each}
</div>
