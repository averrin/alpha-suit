<script>
   import { system } from "../../modules/stores.js";

   import SelectedDocument from "./SelectedDocument.svelte";
   export let item;

   function formatDescription(desc) {
      const roll = `<a class="inline-roll roll" title="$1" data-mode="roll" data-formula="$1" style="color: #232323; border-radius: 4px; font-weight: bold"><i class="fas fa-dice-d20" style="margin-right: 4px"></i>$1</a>`;
      desc = desc.replaceAll(new RegExp(/\[\[\/r (\w+)\]\]/g), roll);
      return desc;
   }
</script>

{#if $item}
   <div class="ui-p-2 ui-flex ui-flex-col ui-gap-2">
      <SelectedDocument bind:item />

      <div class="ui-input-group ui-input-group-md">
         <span>Type</span>
         <div
            class="ui-px-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
         >
            {$item.type}
         </div>
      </div>

      <div
         class="ui-text-base-content ui-rounded-md ui-px-4 ui-py-2"
         style="background-color: hsl(var(--b3)/var(--tw-bg-opacity));"
      >
         {@html formatDescription($item?.data?.data?.description?.value)}
      </div>
   </div>
{/if}
