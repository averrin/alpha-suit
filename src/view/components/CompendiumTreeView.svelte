<script>
   import TreeItemComponent from "./TreeItem.svelte";
   import { compendiumTree, expanded, selectedBrowser } from "../../modules/stores.js";
   import { SETTINGS } from "../../modules/constants";
   import { setting } from "crew-components/helpers";

   function toggleExpanded(node) {
      expanded.update((ex) => {
         const isExpanded = ex.some((i) => i == node.id);
         if (isExpanded) {
            return ex.filter((i) => i != node.id);
         } else {
            ex.push(node.id);
            return ex;
         }
      });
   }

   function itemClick(e, force = false) {
      const { node, event } = e.detail;
      const isFolder = node.source.content;
      if (!isFolder) {
         if (!force && !setting(SETTINGS.INVERT_CLICKS)) return handleSelection(e, true);
         node.source?.apps[0].render(true);
      } else {
         if (!event.ctrlKey) {
            toggleExpanded(node);
         } else {
            node.source?.apps[0].render(true);
         }
      }
   }

   function handleSelection(e, force = false) {
      if (!force && !setting(SETTINGS.INVERT_CLICKS)) return itemClick(e, true);
      const { node, event } = e.detail;
      const isFolder = node.source.content;
      if (isFolder) return;
      selectedBrowser.update((items) => {
         let isSelected = items.some((i) => i == node.id);
         items = [];
         if (isSelected) {
         } else {
            items = [node.id];
         }
         return items;
      });
   }
</script>

<div>
   <TreeItemComponent
      node={Object.values($compendiumTree).find((i) => i.root)}
      bind:nodes={$compendiumTree}
      isRoot={true}
      showTags={true}
      disableReorder={true}
      on:click={itemClick}
      selected={selectedBrowser}
      on:select={handleSelection}
   />
</div>
