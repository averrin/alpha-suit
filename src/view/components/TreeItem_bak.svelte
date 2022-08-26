<script>
   import { dndzone, SHADOW_PLACEHOLDER_ITEM_ID } from "svelte-dnd-action";
   import { selected, expanded } from "../../modules/stores.js";
   import { loadIcon } from "iconify-icon";
   import { onDestroy } from "svelte";

   export let item;
   export let isRoot = false;
   export let items = [];
   const isFolder = item.source instanceof Folder;
   const isActor = item.source instanceof Actor;
   let type = isActor ? "Actor" : "Folder";

   let isSelected = false;
   let isExpanded = true;
   // const unsub = selected.subscribe((items) => {
   //    isSelected = items.some((i) => i == item.id);
   // });
   // onDestroy(unsub);

   // const unsub2 = expanded.subscribe((items) => {
   //    isExpanded = items.some((i) => i == item.id);
   // });
   // onDestroy(unsub2);

   let dragDisabled = false;

   function itemClick(e) {
      if (!isFolder) {
         item.source?.sheet.render(true);
      } else {
         toggleExpanded();
      }
   }
   function toggleExpanded() {
      expanded.update((ex) => {
         if (isExpanded) {
            return ex.filter((i) => i != item.id);
         } else {
            ex.push(item.id);
            return ex;
         }
      });
   }
   function drag(e) {
      e.dataTransfer.setData("text/plain", JSON.stringify({ type, id: item.source?.id }));
   }
   function handleDndConsider(e) {
      item.children = e.detail.items;
   }
   function handleDndFinalize(e) {
      item.children = e.detail.items;
      // setTimeout(() => {
      //    let n = 0;
      //    for (const ch of item.children) {
      //       if (items[ch.id].source) {
      //          items[ch.id].source.update({ sort: n, folder: item.source.id });
      //          n++;
      //       }
      //    }
      // }, 100);
      items = { ...items };
      // document.querySelectorAll(".tree-item").forEach((e) => {
      //    e.style.visibility = "visible";
      // });
   }

   function checkShift(e) {
      dragDisabled = !e.shiftKey;
      document.querySelectorAll(".tree-item").forEach((e) => {
         e.removeAttribute("draggable");
         e.ondragstart = () => true;
         e.style.visibility = "visible";
      });
   }

   // setTimeout(() => {
   //    document.querySelectorAll(".tree-item").forEach((e) => {
   //       e.removeAttribute("draggable");
   //       e.ondragstart = () => true;
   //    });
   // }, 100);

   function onPointerDown(e) {
      // if (e.which == 3) {
      //    selected.update((items) => {
      //       if (isSelected) {
      //          items = items.filter((i) => i != item.id);
      //          for (const child of items) {
      //             items = items.filter((i) => i != child.id);
      //          }
      //       } else {
      //          items.push(item.id);
      //          for (const child of items) {
      //             items.push(child.id);
      //          }
      //       }
      //       return items;
      //    });
      // }
   }
</script>

{#if item}
   {#if !isRoot}
      <div
         class="ui-border ui-border-base-300 ui-bg-base-100 ui-rounded-box ui-rounded-md
   ui-flex ui-flex-col ui-items-start ui-justify-center tree-item ui-border"
         on:click={itemClick}
         class:selected={isSelected}
         style:color={item.color}
         style:border-color={item.color != "#232323" ? item.color : "#ddd"}
         on:pointerdown={onPointerDown}
         id={item.id}
      >
         <div class="ui-flex ui-flex-row ui-w-full ui-justify-center">
            <div class="ui-text-xs ui-font-medium ui-flex ui-flex-row ui-gap-2 ui-flex-1 ui-w-full ui-items-center">
               {#if isFolder}
                  {#if !isExpanded}
                     {#if item.children?.length > 0}
                        <iconify-icon icon="fa-solid:folder-plus" class="ui-ml-2 ui-text-lg" />
                     {:else}
                        <iconify-icon icon="fa-solid:folder-minus" class="ui-ml-2 ui-text-lg" />
                     {/if}
                  {:else}
                     <iconify-icon icon="fa-solid:folder-open" class="ui-ml-2 ui-text-lg" />
                  {/if}
               {:else if isActor}
                  <img
                     class="ui-h-8 ui-border-none ui-rounded-md"
                     src={item.source.thumbnail}
                     alt="thumb"
                     draggable={true}
                     on:pointerdown={() => null}
                     on:dragstart={drag}
                     style:cursor="grab"
                  />
               {/if}
               {item.name}
            </div>

            <div class="ui-btn-group ui-justify-self-end ui-flex-none">
               {#if item.children?.length > 0}
                  <button
                     title="toggle expanded"
                     class="ui-btn ui-btn-square ui-btn-link ui-justify-self-end ui-btn-xs ui-w-[1.5rem] ui-p-0"
                     on:pointerdown={(e) => null}
                     on:click|stopPropagation={(e) => toggleExpanded()}
                  >
                     {item.children?.length}
                  </button>
               {/if}

               {#if isSelected}
                  <iconify-icon icon="fluent:checkmark-12-filled" class="ui-ml-2 ui-text-lg" />
               {/if}
            </div>
         </div>
      </div>
   {/if}
   {#if isExpanded && (isFolder || isRoot)}
      <div
         class="ui-flex ui-flex-col ui-gap-1 ui-p-1"
         class:ui-ml-6={!isRoot}
         class:ui-h-full={isRoot}
         use:dndzone={{ items: item.children || [], dragDisabled }}
         on:consider={handleDndConsider}
         on:finalize={handleDndFinalize}
         on:mousemove={() => null}
      >
         {#if item.children?.length > 0}
            {#each item.children.filter((child) => child?.id !== SHADOW_PLACEHOLDER_ITEM_ID) as child (child.id)}
               {#if items[child.id]}
                  <svelte:self item={items[child.id]} bind:items />
               {/if}
            {/each}
         {:else}
            <div class="ui-h-8" />
         {/if}
      </div>
   {/if}
{/if}

<style lang="scss">
   .tree-item:hover {
      background-color: #eee;
      border: 1px solid #ccc;
   }
   .tree-item.selected {
      background-color: lavender;
      border: 1px solid #232323;
   }
</style>
