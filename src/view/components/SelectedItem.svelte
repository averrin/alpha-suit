<script>
   import { system } from "../../modules/stores.js";
   import { capitalize } from "crew-components/helpers";
   import { TJSProseMirror } from "@typhonjs-fvtt/svelte-standard/component";

   import SelectedDocument from "./SelectedDocument.svelte";
   export let item;

   function formatDescription(desc) {
      const roll = `<a class="inline-roll roll" title="$1" data-mode="roll" data-formula="$1" style="border-radius: 4px; font-weight: bold"><i class="fas fa-dice-d20" style="margin-right: 4px"></i>$1</a>`;
      const rollT = `<a class="inline-roll roll" title="$1[$2]" data-mode="roll" data-formula="$1" style="border-radius: 4px; font-weight: bold"><i class="fas fa-dice-d20" style="margin-right: 4px"></i>$1 [$2]</a>`;
      desc = desc.replaceAll(new RegExp(/\[\[\/r {?(\w+)}?\]\]/g), roll);
      desc = desc.replaceAll(new RegExp(/\[\[\/r {?(\w+)}?\[(\w+)\]\]\]/g), rollT);
      return desc;
   }
</script>

{#if $item}
   <div class="ui-p-2 ui-flex ui-flex-col ui-gap-2 ui-flex-wrap">
      <SelectedDocument bind:item />
      <h2 class="ui-text-center ui-font-bold">
         {capitalize($item.type)}
      </h2>

      {#if $system.data?.selectedInfo && $system.data?.selectedInfo["Item"] && $system.data?.selectedInfo["Item"][$item.type]?.component}
         <div class="ui-flex ui-flex-row ui-gap-1 ui-items-center ui-flex-wrap">
            <svelte:component this={$system.data?.selectedInfo["Item"][$item.type]?.component} {item} />
         </div>
      {/if}

      <div
         class="ui-text-base-content ui-rounded-md ui-px-4 ui-py-2"
         style="background-color: hsl(var(--b3)/var(--tw-bg-opacity));"
      >
         {#if game.version < 10}
            {@html formatDescription($item?.data?.data?.description?.value)}
         {:else}
            <TJSProseMirror content={$item?.data?.data?.description?.value} options={{ editable: false }} />
         {/if}
      </div>
   </div>
{/if}
