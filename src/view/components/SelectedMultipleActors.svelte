<script>
   export let items;
   import SelectedDocument from "./SelectedDocument.svelte";
   import Tags from "crew-components/Tags";
   import { getFlag, setFlag } from "crew-components/helpers";
   import { selected } from "../../modules/stores.js";
   import { onDestroy, tick } from "svelte";

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
      logger.info("update m tags");
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
</script>

<div class="ui-flex ui-flex-col ui-flex-none ui-gap-2 ui-p-2">
   <div class="ui-flex ui-flex-row ui-gap-3 ui-justify-center ui-items-center">
      <div class="ui-flex ui-flex-row ui-flex-1 ui-text-lg ui-items-center ui-justify-center ui-w-full">
         Selected: {count}
      </div>

      <div class="ui-flex ui-flex-row ui-flex-none">
         <div class="ui-btn-group">
            <button class="ui-btn ui-btn-square ui-btn-error" on:click={removeAll}>
               <iconify-icon icon="fluent:delete-20-filled" class="ui-text-xl" />
            </button>
         </div>
      </div>
   </div>

   <div class="ui-flex ui-flex-row ui-gap-3">
      <div class="ui-input-group">
         <span>Mutual</span>
         <Tags on:tags={onMutualTags} tags={tagsMutual} allowPaste={true} allowDrop={true} onlyUnique={true} />
      </div>
   </div>
</div>

<div class="ui-flex ui-flex-col ui-gap-2 ui-overflow-auto ui-flex-1 ui-p-2">
   {#each $items as item (item.id)}
      <div class="ui-divider ui-my-0" />
      <SelectedDocument bind:item />
   {/each}
</div>
