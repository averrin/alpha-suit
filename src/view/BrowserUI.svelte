<svelte:options accessors={true} />

<script>
   import AlphaShell from "./AlphaShell.svelte";
   import { tagsStore, system, browserMode } from "../modules/stores.js";
   import { setContext } from "svelte";
   import CompendiumsMode from "./components/CompendiumsMode.svelte";
   import AdvancedMode from "./components/AdvancedMode.svelte";
   import Tag from "crew-components/Tag";

   export let elementRoot;

   setContext("tagsStore", tagsStore);

   const availableTabs = [{ title: "Compendiums", icon: "fa-solid:atlas" }, ...($system?.tabs || [])];

   browserMode.set(availableTabs[0]);
   function selectMode(t) {
      browserMode.set(t);
   }
</script>

<AlphaShell bind:elementRoot id="browser">
   <div class="ui-flex ui-flex-col ui-w-full">
      <div class="ui-p-1">
         <div class="ui-tabs ui-tabs-boxed">
            <div class="ui-mr-2">
               <Tag
                  tag={{ text: globalThis.game.system.id, color: $system.data.id != "*" ? "#5b21b6" : "#aa0000" }}
                  compact={true}
               />
            </div>
            <div class="ui-flex ui-flex-1 ui-flex-row ui-w-full ui-justify-center ui-items-center ui-flex-wrap">
               {#each availableTabs as t (t.title)}
                  <a
                     class="ui-tab ui-tab-xs ui-text-base-content"
                     on:click={() => selectMode(t)}
                     class:ui-tab-active={t.title == $browserMode.title}
                  >
                     <iconify-icon icon={t.icon} class="ui-mr-2 ui-text-lg ui-text-base-content" />
                     {t.title}
                  </a>
               {/each}
            </div>
            <iconify-icon
               icon="clarity:help-solid"
               class="ui-text-lg icon-button ui-flex-none ui-text-base-content"
               on:click={AlphaSuit.showHelp}
               on:pointerdown={(_) => null}
            />
         </div>
      </div>

      {#if $browserMode.title == "Compendiums"}
         <CompendiumsMode />
      {:else}
         <AdvancedMode />
      {/if}
   </div>
</AlphaShell>
