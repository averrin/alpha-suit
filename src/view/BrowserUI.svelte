<svelte:options accessors={true} />

<script>
   import { tagsStore, system, browserMode, theme } from "../modules/stores.js";
   import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
   import "../main.scss";
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

<ApplicationShell bind:elementRoot>
   <main class="alpha-ui ui-flex ui-flex-col ui-container" data-theme={$theme}>
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
   </main>
</ApplicationShell>
