<svelte:options accessors={true} />

<script>
   import TreeItemComponent from "./components/TreeItem.svelte";
   import TwoColUI from "./TwoColUI.svelte";
   import { settingsTopic, settingsTree, expanded, selectedSetting, theme } from "../modules/stores.js";
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
      selectedSetting.update((items) => {
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
      selectedSetting.subscribe((s) => {
         settingsTopic.set(s[0]);
         topic = $settingsTree[s[0]];
         logger.info(topic);
      })
   );
</script>

<TwoColUI bind:elementRoot id="settings">
   <TreeItemComponent
      slot="left"
      node={Object.values($settingsTree).find((i) => i.root)}
      bind:nodes={$settingsTree}
      isRoot={true}
      showTags={false}
      disableReorder={true}
      on:click={itemClick}
      on:select={handleSelection}
      selected={selectedSetting}
   />
   <div slot="right">
      {#if topic?.component}
         <svelte:component this={topic.component} />
      {:else if topic?.content}
         {@html topic.content}
      {:else}
         <h1>Welcome to the Settings</h1>
         <p>Please select a page from the left sidebar.</p>
         <p>Version: {game.modules.get("alpha-suit").data.version}</p>
      {/if}
   </div>
</TwoColUI>
