<svelte:options accessors={true} />

<script>
   import TreeItemComponent from "./components/TreeItem.svelte";
   import TwoColUI from "./TwoColUI.svelte";
   import { helpTopic, helpTree, expanded, selectedHelp, theme } from "../modules/stores.js";
   import { onDestroy } from "svelte";

   export let elementRoot;

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
   function itemClick(e) {
      const { node, event } = e.detail;
      if (node?.children?.length > 0) {
         toggleExpanded(node);
      } else {
         handleSelection(e);
      }
   }

   function handleSelection(e) {
      const { node, event } = e.detail;
      const isFolder = node.children?.length > 0;
      if (isFolder) return;
      selectedHelp.update((items) => {
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
      selectedHelp.subscribe((s) => {
         helpTopic.set(s[0]);
         topic = $helpTree[s[0]];
      })
   );
</script>

<TwoColUI bind:elementRoot id="help">
   <TreeItemComponent
      slot="left"
      node={Object.values($helpTree).find((i) => i.root)}
      bind:nodes={$helpTree}
      isRoot={true}
      showTags={false}
      disableReorder={true}
      on:click={itemClick}
      on:select={handleSelection}
      selected={selectedHelp}
   />
   <div slot="right">
      {#if topic?.component}
         <svelte:component this={topic.component} />
      {:else if topic?.content}
         {@html topic.content}
      {:else}
         <h1>Welcome to the Help Center</h1>
         <p>Please select a page from the left sidebar.</p>
      {/if}
   </div>
</TwoColUI>
