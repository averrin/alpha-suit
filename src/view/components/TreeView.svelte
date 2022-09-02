<script>
   import TreeItemComponent from "./TreeItem.svelte";
   import { treeItems } from "../../modules/stores.js";
   import { selected, expanded, filter, currentCollection, isDragging } from "../../modules/stores.js";
   import { dndzone, SHADOW_PLACEHOLDER_ITEM_ID, TRIGGERS } from "svelte-dnd-action";
   import { tick } from "svelte";
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

      const isFolder = node.source instanceof Folder || node.source?.depth;
      if (!isFolder) {
         if (!force && !setting(SETTINGS.INVERT_CLICKS)) return handleSelection(e, true);
         node.source?.sheet.render(true);
      } else {
         if (!event.ctrlKey) {
            toggleExpanded(node);
         } else {
            if (!force && !setting(SETTINGS.INVERT_CLICKS)) return handleSelection(e, true);
            node.source?.sheet.render(true);
         }
      }
   }

   function updateItemsParent(newItems, node) {
      let n = 0;
      let dn = 0;
      const updates = [];
      const dir_updates = [];
      const nodes = $treeItems;
      let u;
      for (const ch of newItems) {
         if (ch.id in nodes && nodes[ch.id].source) {
            const doc = $currentCollection.get(ch.id) || game.folders.get(ch.id);
            const changes = {
               _id: doc.id,
            };
            if (doc instanceof Folder || doc.depth) {
               u = dir_updates;
               changes["sort"] = dn;
               changes["parent"] = node.source.id || node.source?.folder?.id || null;
               dn++;
            } else {
               u = updates;
               changes["sort"] = n;
               changes["folder"] = node.source.id || node.source?.folder?.id || null;
               n++;
            }

            u.push(changes);
         }
         Folder.updateDocuments(dir_updates);
         $currentCollection.documentClass.updateDocuments(updates, { parent: null });
      }
   }

   function handleDndConsider(e) {
      const { node, event } = e.detail;
      isDragging.set(true);
      let {
         items: newItems,
         info: { trigger, source, id },
      } = event.detail;

      let sel = $selected.some((i) => i == id);
      if (sel && $selected.length) {
         if (trigger === TRIGGERS.DRAG_STARTED) {
            newItems = newItems.filter((i) => !$selected.includes(i.id));
         }
      } else {
      }
      node.children = newItems;
      $treeItems = { ...$treeItems };
   }

   function handleDndFinalize(e) {
      isDragging.set(false);
      const { node, event } = e.detail;
      let nodes = $treeItems;
      let {
         items: newItems,
         info: { trigger, source, id },
      } = event.detail;

      let sel = $selected.some((i) => i == id);
      if (sel && $selected.length) {
         if (trigger === TRIGGERS.DROPPED_INTO_ANOTHER) {
            newItems = newItems.filter((i) => !$selected.includes(i.id));
         } else if (trigger === TRIGGERS.DROPPED_INTO_ZONE || trigger === TRIGGERS.DROPPED_OUTSIDE_OF_ANY) {
            tick().then(async () => {
               const idx = newItems.findIndex((item) => item.id === id);
               const sidx = Math.max($selected.indexOf(id), 0);
               newItems = newItems.filter((item) => !$selected.includes(item.id));
               newItems.splice(idx - sidx, 0, ...$selected.map((i) => nodes[i]));

               updateItemsParent(newItems, node);
               node.children = newItems;
            });
         }
      } else {
         if (node.id != "root") node.source?.folder?.update({ sorting: "m" });

         updateItemsParent(node.children, node);
         // nodes = { ...nodes };
         node.children = newItems;
      }
   }

   function handleSelection(e, force = false) {
      if (!force && !setting(SETTINGS.INVERT_CLICKS)) return itemClick(e, true);
      const { node, event } = e.detail;
      selected.update((items) => {
         let isSelected = items.some((i) => i == node.id);
         if (isSelected) {
            const f = (node) => {
               items = items.filter((i) => i != node.id);
               node.children?.map((ch) => $treeItems[ch.id]).forEach(f);
            };
            f(node);
         } else {
            if (!event.ctrlKey) {
               items = [];
            }
            const f = (node) => {
               items.push(node.id);
               node.children?.map((ch) => $treeItems[ch.id]).forEach(f);
            };
            f(node);
         }
         return items;
      });
   }
</script>

<div class="ui-h-full">
   <TreeItemComponent
      node={Object.values($treeItems).find((i) => i.root)}
      bind:nodes={$treeItems}
      isRoot={true}
      showTags={true}
      on:click={itemClick}
      on:finalize={handleDndFinalize}
      on:consider={handleDndConsider}
      on:select={handleSelection}
      {selected}
      showCreateButtons={true}
   />
</div>
