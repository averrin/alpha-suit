<svelte:options accessors={true} />

<script>
   import TreeItemComponent from "./components/TreeItem.svelte";
   import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
   import "../main.scss";
   import { helpTopic, helpTree, expanded, selectedHelp, theme } from "../modules/stores.js";
   import { onDestroy, getContext } from "svelte";

   const { application } = getContext("external");
   const position = application.position;
   const { height } = position.stores;
   let contentH = $height;
   onDestroy(height.subscribe((h) => (contentH = h - 30)));

   export let elementRoot;

   function toggleExpanded(node) {
      expanded.update((ex) => {
         const isExpanded = ex.some((i) => i == node.id);
         logger.info(isExpanded);
         if (isExpanded) {
            return ex.filter((i) => i != node.id);
         } else {
            ex.push(node.id);
            return ex;
         }
      });
      logger.info($expanded);
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
         logger.info(topic);
      })
   );
</script>

<ApplicationShell bind:elementRoot>
   <main class="ui-flex ui-flex-row ui-gap-2 ui-container ui-text-base-content" data-theme={$theme}>
      <div class="alpha-ui ui-bg-base-100 ui-flex-col ui-flex ui-w-[30%]">
         <div>
            <TreeItemComponent
               node={Object.values($helpTree).find((i) => i.root)}
               bind:nodes={$helpTree}
               isRoot={true}
               showTags={false}
               disableReorder={true}
               on:click={itemClick}
               on:select={handleSelection}
               selected={selectedHelp}
            />
         </div>
      </div>
      <div class="ui-bg-base-100 ui-flex-col ui-flex ui-w-[70%] ui-p-2" id="help-page" style="height: {contentH}px;">
         <div class="ui-h-full ui-overflow-y-auto">
            {#if topic?.component}
               <svelte:component this={topic.component} />
            {:else if topic?.content}
               {@html topic.content}
            {:else}
               <h1>Welcome to the Help Center</h1>
               <p>Please select a page from the left sidebar.</p>
            {/if}
         </div>
      </div>
   </main>
</ApplicationShell>
