<svelte:options accessors={true} />

<script>
   import { tagsStore, system } from "../modules/stores.js";
   import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
   import "../main.scss";
   import { setContext } from "svelte";
   import { writable } from "svelte/store";
   import CompendiumsMode from "./components/CompendiumsMode.svelte";
   import AdvancedMode from "./components/AdvancedMode.svelte";
   import Tag from "crew-components/Tag";
   import BrowserSettings from "./components/BrowserSettings.svelte";

   export let elementRoot;

   setContext("tagsStore", tagsStore);

   const availableTabs = [
      { title: "Compendiums", icon: "fa-solid:atlas" },
      ...($system?.tabs || []),
      { title: "Settings", icon: "fa6-solid:gears" },
   ];

   let mode = writable(availableTabs[0]);
   // selectMode(availableTabs[0])
   function selectMode(t) {
      mode.set(t);
   }
</script>

<ApplicationShell bind:elementRoot>
   <main class="ui-flex ui-flex-col ui-container">
      <div class="ui-p-2">
         <div class="ui-tabs ui-tabs-boxed">
            <div class="ui-mr-2">
               <Tag
                  tag={{ text: globalThis.game.system.id, color: $system.data.id != "*" ? "#5b21b6" : "#aa0000" }}
                  compact={true}
               />
            </div>
            {#each availableTabs as t (t.title)}
               <a
                  class="ui-tab ui-tab-xs ui-text-black"
                  on:click={() => selectMode(t)}
                  class:ui-tab-active={t.title == $mode.title}
               >
                  <iconify-icon icon={t.icon} class="ui-mr-2 ui-text-lg" />
                  {t.title}
               </a>
            {/each}
         </div>
      </div>

      {#if $mode.title == "Compendiums"}
         <CompendiumsMode />
      {:else if $mode.title == "Settings"}
         <BrowserSettings />
      {:else}
         <AdvancedMode {mode} />
      {/if}
   </main>
</ApplicationShell>
