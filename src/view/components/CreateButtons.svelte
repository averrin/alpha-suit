<script>
   import { currentCollection, expanded } from "../../modules/stores.js";
   import InlineButton from "crew-components/InlineButton";
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
   <InlineButton title="Create folder" icon="eva:folder-add-fill" on:click={createFolder} />
   <InlineButton title="Create document" icon="eva:file-add-fill" on:click={createDocument} />
</div>

<style>
</style>
