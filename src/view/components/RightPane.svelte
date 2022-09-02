<script>
   import { onDestroy } from "svelte";
   import SelectedActor from "./SelectedActor.svelte";
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

{#if $selectedObjects.length == 1}
   {#if $currentCollection.documentName == "Actor"}
      <SelectedActor bind:item={selectedObject} />
   {:else}
      <div class="ui-p-2">
         <SelectedDocument bind:item={selectedObject} />
      </div>
   {/if}
{:else}
   <SelectedMultipleActors items={selectedObjects} />
{/if}
<!-- {#if !$isDragging} -->
<!-- {:else} -->
<!--    dragging in progress -->
<!-- {/if} -->
