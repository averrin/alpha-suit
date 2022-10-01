<script>
   import { onDestroy } from "svelte";
   import SelectedActor from "./SelectedActor.svelte";
   import SelectedItem from "./SelectedItem.svelte";
   import SelectedScene from "./SelectedScene.svelte";
   import SelectedDocument from "./SelectedDocument.svelte";
   import SelectedMultipleActors from "./SelectedMultipleActors.svelte";
   import { writable } from "svelte/store";

   import { selected, currentCollection, isDragging } from "../../modules/stores.js";

   let selectedObjects = writable([]);
   let selectedObject = writable(null);
   const unsub = selected.subscribe((s) => {
      const objects = s.map((id) => $currentCollection.get(id) || game.folders.get(id));
      selectedObjects.set(objects);
      selectedObject.set(objects[0]);
      console.log("selected", objects[0]?.name);
   });
   onDestroy(unsub);
</script>

<div class="ui-flex ui-flex-col ui-h-full ui-overflow-auto">
   {#if $selectedObjects.length == 1}
      {#if $currentCollection.documentName == "Actor"}
         <SelectedActor bind:item={selectedObject} />
      {:else if $currentCollection.documentName == "Item"}
         <SelectedItem bind:item={selectedObject} />
      {:else if $currentCollection.documentName == "Scene"}
         <SelectedScene bind:item={selectedObject} />
      {:else}
         <div class="ui-p-2">
            <SelectedDocument bind:item={selectedObject} />
         </div>
      {/if}
   {:else}
      <SelectedMultipleActors items={selectedObjects} />
   {/if}
</div>
