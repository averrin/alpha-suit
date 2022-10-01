<svelte:options accessors={true} />

<script>
   import TreeItemComponent from "./components/TreeItem.svelte";
   import TwoColUI from "./TwoColUI.svelte";
   // import { filesTopic, filesTree, expanded, selectedFolder } from "../modules/stores.js";
   import { expanded, addTree } from "../modules/stores.js";
   import { onDestroy, tick } from "svelte";
   import { capitalize } from "crew-components/helpers";
   import { writable } from "svelte/store";
   import LeftPane from "./components/LeftPane.svelte";
   import { TreeItem } from "../modules/Tree.js";

   export let elementRoot;

   const selectedFolder = writable([]);
   const filesTree = writable(null);
   const filesTopic = writable(null);

   const fetched = {};
   const tree = {};
   let sources = globalThis.game.data.files.storages.map((id) => {
      return {
         id,
         title: capitalize(id),
         children: [],
         content: [],
         icon: "fa6-solid:folder",
         expandable: true,
         fetched: false,
      };
   });
   tree["root"] = { children: sources };

   export function buildFilesTree() {
      logger.info(tree);
      let items = {};
      const list = addTree(tree["root"], null, async (item) => {
         item.children = await fetchFolder(item);
         return item;
      });
      list.forEach((i) => (items[i.id] = i));

      return items;
   }

   filesTree.set(buildFilesTree());

   function fetchFolder(node) {
      const store = node.id.split("/")[0];
      let path = ".";
      if (node.id != store) {
         path = "./" + node.id.replace(store + "/", "");
      }
      logger.info(`fetching store: ${store}, path: ${path}`);
      return FilePicker.browse(store, path).then((res) => {
         return res.dirs.map((id) => {
            let base = id.split("/");
            base = base[base.length - 1];
            return TreeItem.from({
               id: `${node.id}/${base}`,
               children: [],
               content: [],
               title: base,
               name: base,
               icon: "fa6-solid:folder",
               expandable: true,
            });
         });
         // node.fetched = true;
         // tree[node.id] = node;
         // filesTree.set(buildFilesTree());
         // logger.info($filesTree);
         // expanded.update((ex) => {
         //    ex.push(node.id);
         //    return ex;
         // });
      });
   }

   function toggleExpanded(node) {
      expanded.update((ex) => {
         const isExpanded = ex.some((i) => i == node.id);
         if (isExpanded) {
            return ex.filter((i) => i != node.id);
         } else {
            // tick().then((_) => fetchFolder(node));
            ex.push(node.id);
            return ex;
         }
      });
   }
   function itemClick(e) {
      const { node, event } = e.detail;
      if (node?.expandable) {
         toggleExpanded(node);
      } else {
         handleSelection(e);
      }
   }

   function handleSelection(e) {
      const { node, event } = e.detail;
      const isFolder = node.children?.length > 0;
      if (isFolder) return;
      selectedFolder.update((items) => {
         let isSelected = items.some((i) => i == node.id);
         items = [];
         if (isSelected) {
         } else {
            items = [node.id];
         }
         return items;
      });
   }

   let topic;
   onDestroy(
      selectedFolder.subscribe((s) => {
         filesTopic.set(s[0]);
         topic = $filesTree[s[0]];
      })
   );
</script>

<TwoColUI bind:elementRoot id="files">
   <TreeItemComponent
      slot="left"
      node={Object.values($filesTree).find((i) => i.root)}
      bind:nodes={$filesTree}
      isRoot={true}
      showTags={false}
      disableReorder={true}
      on:click={itemClick}
      on:select={handleSelection}
      selected={selectedFolder}
   />
   <div slot="right">
      {#if topic?.component}
         <svelte:component this={topic.component} />
      {:else if topic?.content}
         {@html topic.content}
      {:else}
         <!-- <h1>Welcome to the File Manager</h1> -->
         <!-- <p>Please select a folder from the left sidebar.</p> -->
         <div style="font-size: 4rem">
            <iconify-icon icon="gi:badger" />
            <iconify-icon icon="gi:evil-bud" />
            <iconify-icon icon="gi:pharoah" />
            <iconify-icon icon="gi:elf-ear" />
         </div>
      {/if}
   </div>
</TwoColUI>
