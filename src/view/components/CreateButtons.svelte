<script>
   import { currentCollection, expanded } from "../../modules/stores.js";
   import { tick } from "svelte";
   export let parent = null;

   function createDocument(e) {
      e.stopPropagation();
      const options = { width: 320, left: window.innerWidth - 630 };
      $currentCollection.documentClass.createDialog({ folder: parent?.id || parent?.folder?.id }, options);
      if (parent) {
         expanded.update((ex) => {
            ex.push(parent.id || parent.folder?.id);
            return ex;
         });
      }
   }
   function createFolder(e) {
      e.stopPropagation();
      const options = { width: 320, left: window.innerWidth - 630 };
      Folder.createDialog({ parent: parent?.folder || parent, type: $currentCollection.documentName }, options);
      if (parent) {
         expanded.update((ex) => {
            ex.push(parent.id || parent.folder?.id);
            return ex;
         });
      }
   }
</script>

<div class="ui-flex ui-flex-row ui-flex-0 ui-justify-end">
   <iconify-icon
      icon="eva:folder-add-fill"
      class="ui-text-lg icon-button"
      on:click={createFolder}
      on:pointerdown={(_) => null}
   />
   <iconify-icon
      icon="eva:file-add-fill"
      class="ui-text-lg icon-button"
      on:click={createDocument}
      on:pointerdown={(_) => null}
   />
</div>

<style>
</style>
