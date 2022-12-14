<script>
   import { logger, getFlag, setFlag, hasFlag } from "crew-components/helpers";
   import Tags from "crew-components/Tags";
   import DocumentThumb from "./DocumentThumb.svelte";
   import CreateButtons from "./CreateButtons.svelte";
   import Permissions from "./Permissions.svelte";
   import { writable } from "svelte/store";
   import { createFilter } from "crew-components/helpers";

   import { dndzone, SHADOW_PLACEHOLDER_ITEM_ID, TRIGGERS } from "svelte-dnd-action";
   import { expanded, filter, currentCollection, isDragging } from "../../modules/stores.js";
   import { onDestroy, tick, createEventDispatcher } from "svelte";

   const dispatch = createEventDispatcher();

   export let nodes = {};
   export let node;
   export let isRoot = false;
   export let showTags = false;
   export let disableReorder = false;
   export let showCreateButtons = false;
   export let extraComponents;
   const minHeight = "1.8rem";

   const isFolder = node?.source instanceof Folder || node?.source?.depth;
   const isActor = node?.source instanceof Actor;
   const isScene = node?.source instanceof Scene;

   let decorColor;
   if (isActor && node.source.type == "character") {
      for (const user of game.users.contents) {
         if (user.character?.id == node.id) {
            decorColor = user.data.color;
         }
      }
   }

   let isSelected = false;
   let isExpanded = isRoot;
   export let selected = null;

   let thumbnail = node?.thumbnail;
   $: thumbnail = node?.thumbnail;

   function onTagClick(_, tag) {
      filter.update((f) => {
         f.filters = f.filters || [];
         f.filters.push(createFilter({}, tag, ""));
         return f;
      });
   }

   if (!isRoot && selected) {
      const unsub = selected.subscribe((items) => {
         isSelected = items.some((i) => i == node.id);
         if (isFolder && isSelected) {
            if (!node.children.every((i) => items.includes(i.id))) {
               $selected = $selected.filter((i) => i != node.id);
            }
         }
      });
      onDestroy(unsub);
   }

   const unsub2 = expanded.subscribe((items) => {
      isExpanded = items.some((i) => i == node.id);
   });
   onDestroy(unsub2);

   function handleDndConsider(e) {
      dispatch("consider", { node, event: e });
   }

   function handleDndFinalize(e) {
      dispatch("finalize", { node, event: e });
   }

   function itemClick(e) {
      dispatch("click", { node, event: e });
   }

   function onPointerDown(e) {
      if (e.which == 3) {
         dispatch("select", { node, event: e });
      }
   }

   function fixThumbs() {
      document.querySelectorAll(".item").forEach((e) => {
         e.removeAttribute("draggable");
         e.ondragstart = () => true;
      });
   }

   let dragDisabled = true;
   function checkShift(e) {
      if (disableReorder) return;
      dragDisabled = !e.shiftKey;
      fixThumbs();
   }

   tick().then(fixThumbs);

   function transformItem(element, data, index) {
      let sel = $selected.some((i) => i == data.id);
      if (sel && $selected.length > 1 && element.querySelectorAll(".ui-stack").length == 0) {
         element.querySelector(
            ".name"
         ).innerHTML = `<span class='ui-font-bold'>Dragging: ${$selected.length} items</span>`;
         const content = element.innerHTML;
         element.innerHTML = `<div class="ui-stack">${content}${content}${content}</div>`;
      }
   }
</script>

{#if !isRoot}
   <div
      class="ui-bg-cover ui-border-solid ui-border-base-300 ui-bg-base-200 ui-rounded-box ui-rounded-md
   ui-flex ui-flex-col ui-items-start ui-justify-center tree-item ui-border tree-item ui-pr-2"
      style:min-height={minHeight}
      on:click={itemClick}
      class:selected={isSelected}
      class:ui-ring={isSelected}
      style:color={node.color == "#000000" ? "hsv(var(--bc))" : node.color}
      style:border-color={node.color != "#232323" ? node.color : "hsl(var(--b3))"}
      on:pointerdown={onPointerDown}
      id={node.id}
      title={`${node.name}`}
      style:background-image={isScene ? `url(${thumbnail})` : "none"}
   >
      <div class="ui-flex ui-flex-row ui-w-full ui-justify-center">
         <div class="ui-text-xs ui-font-medium ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-w-full ui-items-center">
            {#if isFolder}
               <DocumentThumb widthAuto={true} item={writable(node.source.folder)}>
                  {#if !isExpanded}
                     {#if node.children?.length > 0}
                        <iconify-icon
                           icon="fa-solid:folder-plus"
                           class="ui-ml-2 ui-text-lg ui-text-base-content"
                           style:color={node.color == "#000000" ? "hsv(var(--bc))" : node.color}
                        />
                     {:else}
                        <iconify-icon
                           icon="fa-solid:folder-minus"
                           class="ui-ml-2 ui-text-lg ui-text-base-content"
                           style:color={node.color == "#000000" ? "hsv(var(--bc))" : node.color}
                        />
                     {/if}
                  {:else}
                     <iconify-icon
                        icon="fa-solid:folder-open"
                        class="ui-ml-2 ui-text-lg ui-text-base-content"
                        style:color={node.color == "#000000" ? "hsv(var(--bc))" : node.color}
                     />
                  {/if}
               </DocumentThumb>
            {:else if thumbnail}
               {#if !isScene}
                  <div class="ui-h-8 ui-w-8">
                     <DocumentThumb item={writable(node.source)} fromCompendium={node.compendium} />
                  </div>
               {:else}
                  <div class="ui-mr-1" />
               {/if}
            {:else if node.icon}
               <iconify-icon
                  icon={node.icon}
                  class="ui-ml-2 ui-text-lg ui-text-base-content"
                  style:color={node.color == "#000000" ? "hsv(var(--bc))" : node.color}
               />
            {:else}
               <div class="ui-mr-1" />
            {/if}
            <div class="ui-flex ui-flex-col">
               <span
                  class="name ui-color-base-content ui-text-base-content"
                  class:ui-underline={decorColor}
                  style:text-decoration-color={decorColor}
                  class:ui-text-shadow-lg={isScene}
               >
                  {node.name}
               </span>
               {#if !isFolder}
                  <span class="ui-text-[0.5rem] !ui-text-[#999] ui-flex ui-row ui-items-center ui-gap-1">
                     {#if node.source?.type}
                        {node.source.type}
                        {#if node.source?.data?.permission}
                           <Permissions item={node.source} />
                        {/if}
                     {/if}
                     <slot name="info" />
                  </span>
               {/if}
            </div>
         </div>

         <div
            class="ui-justify-self-end ui-flex-none ui-flex ui-flex-row ui-justify-center ui-items-center ui-gap-1 ui-max-w-1/2 ui-overflow-hidden ui-max-h-16"
         >
            {#if isFolder && showCreateButtons}
               <div class="create-buttons">
                  <CreateButtons parent={node.source} />
               </div>
            {/if}
            {#if showTags && getFlag(node.source, "tagger")?.tags?.length > 0}
               <div>
                  <Tags {onTagClick} tags={getFlag(node.source, "tagger")?.tags} disable={true} />
               </div>
            {/if}
            {#if node.extraIcons}
               {#each node.extraIcons as icon}
                  <iconify-icon {icon} class="ui-text-md ui-text-zinc-500" />
               {/each}
            {/if}
            {#if node.count > 0}
               <div class="ui-font-bold ui-text-center ui-w-4 ui-text-blue-600">
                  {node.count}
               </div>
            {/if}
            {#if extraComponents}
               {#each extraComponents(node) as component}
                  <svelte:component this={component} item={node} />
               {/each}
            {/if}
         </div>
      </div>
   </div>
{/if}
{#if isExpanded || isRoot}
   <section
      use:dndzone={{
         items: node.children || [],
         dragDisabled,
         dropTargetStyle: { outline: "#33999980 solid 2px" },
         transformDraggedElement: transformItem,
      }}
      on:consider={handleDndConsider}
      on:finalize={handleDndFinalize}
      class="ui-flex ui-flex-col ui-gap-1 ui-p-1 ui-rounded"
      class:ui-pl-6={!isRoot}
      class:ui-h-full={isRoot}
      on:mousemove={checkShift}
      style:background-color="{node?.color != "#232323" ? node?.color : "#dddddd"}30"
      id={node?.id}
   >
      {#if node?.children?.length > 0}
         {#each node.children.filter((item) => item.id !== SHADOW_PLACEHOLDER_ITEM_ID && item.id in nodes) as item (item.id)}
            <div class="item">
               <svelte:self
                  bind:nodes
                  node={nodes[item.id]}
                  {showTags}
                  {disableReorder}
                  {selected}
                  {showCreateButtons}
                  {extraComponents}
                  on:click
                  on:consider
                  on:finalize
                  on:select
               />
            </div>
         {/each}
      {:else}
         <div
            class="ui-pl-4 ui-flex ui-flex-row ui-h-6 ui-text-zinc-400 ui-border-dashed ui-border ui-rounded ui-bg-base-200"
         >
            <div class="ui-flex ui-flex-1 ui-w-full">{node.source.emptyText ?? "empty"}</div>
            {#if showCreateButtons}
               <div class="ui-flex ui-flex-0">
                  <CreateButtons parent={node.source} />
               </div>
            {/if}
         </div>
      {/if}
   </section>
{/if}

<style lang="scss">
   .tree-item .create-buttons {
      display: none;
   }
   .tree-item:hover .create-buttons {
      display: flex;
   }

   .tree-item:hover {
      background-color: hsl(var(--b1));
      border: 1px solid hsl(var(--b2));
   }
   .tree-item.selected {
      border: none !important;
      background-color: #3b82f660;
      background-image: none !important;
   }
   .ui-text-shadow-lg {
      text-shadow: 2px 2px 4px #000, 3px 5px 8px #00000088 !important;
      color: #eee !important;
   }
</style>
