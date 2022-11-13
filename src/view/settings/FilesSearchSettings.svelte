<script>
   import { SETTINGS } from "../../modules/constants.js";
   import SettingsInput from "./SettingsInput.svelte";
   import Icon from "crew-components/Icon";
   import {
      fileIndex,
      indexInProcess,
      rebuildIndex,
      stopFileIndex,
      saveIndex,
      clearSavedIndex,
   } from "../../modules/file_index.js";
   import IndexStatus from "../components/IndexStatus.svelte";
   import { setting } from "crew-components/helpers";
   import { isPremium } from "crew-components/premium";
   import { writable } from "svelte/store";
   import { tick } from "svelte";

   let storages = [...globalThis.game.data.files.storages];

   if (location.host.includes("forge-vtt")) {
      storages.push("forge-bazaar", "forgevtt");
   }

   let mode = setting(SETTINGS.FILES_INDEX_MODE);
   let savedStats = writable("");

   function updateSaved() {
      setTimeout((_) => {
         const stats = setting(SETTINGS.FILE_CACHE_STATS);
         if (stats && stats.count) {
            savedStats.set(`<b>${stats.count}</b> / <b>${stats.size}</b>`);
         } else {
            savedStats.set("<b style='color: red'>NONE</b>");
         }
      }, 200);
   }
   updateSaved();

   async function rebuildFileIndex() {
      if (mode == "persist") {
         await clearSavedIndex();
         updateSaved();
      }
      rebuildIndex();
   }
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">File Manager Settings</div>

   <SettingsInput key={SETTINGS.FILES_FUZZY} premium={true} />


   <SettingsInput key={SETTINGS.FILES_INDEX_MODE} type="select" on:change={(e) => (mode = e.detail.value)} />
   <div class="ui-divider ui-m-0" />

   {#if mode == "persist"}
      <p>
         This mode is like the "Automatic", but once the indexing is done, results are stored and will be used the next
         time without reindexing. You can erse index and rebuild it manually. <br />
         This way ignores new files, but also you can search your files without long and slow indexing.
      </p>
   {/if}

   {#if mode == "auto"}
      <p>
         This mode starts the indexing process every launch. If you have many files it can be time and resource
         consuming. But all your new files will be searchable after page refreesh.
      </p>
      <!-- <SettingsInput key={SETTINGS.FILES_DISABLE_SEARCH} /> -->
      <SettingsInput key={SETTINGS.FILES_INDEX_DELAY} />
      <SettingsInput key={SETTINGS.FILES_SHOW_INDEX_STATUS} premium={true} />
   {/if}

   {#if !(mode == "persist" && !isPremium())}
      <SettingsInput key={SETTINGS.FILES_DEPTH_LIMIT} />
      <SettingsInput key={SETTINGS.FILES_INDEX_COUNT} />

      <SettingsInput key={SETTINGS.FILES_EXCLUDE_SOURCES} type="multiselect" options={storages} />

      <SettingsInput key={SETTINGS.FILES_EXCLUDE_FOLDERS} type="multiselect" onlyAutocomplete={false} />

      <SettingsInput key={SETTINGS.FILES_INDEX_ONLY_ASSETS} />

      <div class="ui-flex ui-flex-row ui-gap-2">
         <button
            class="ui-btn ui-btn-primary ui-btn-md ui-mt-3 ui-flex ui-gap-2"
            style:max-width={!$indexInProcess ? "100%" : "50%"}
            on:click={rebuildFileIndex}
            class:ui-btn-disabled={$indexInProcess}
         >
            <Icon icon="octicon:cache-16" />
            Rebuild index
         </button>
         {#if $indexInProcess}
            <button
               class="ui-max-w-1/2 ui-btn ui-btn-md ui-btn-error ui-mt-3 ui-flex ui-gap-2"
               on:click={(_) => stopFileIndex.set(true)}
            >
               <Icon icon="clarity:stop-solid" />
               Stop indexing
            </button>
         {/if}
      </div>
      <IndexStatus />
      {#if $fileIndex.length > 0 && mode != "persist"}
         <button
            class="ui-btn ui-btn-md ui-mt-3 ui-flex ui-gap-2"
            on:click={(_) => fileIndex.set([])}
            class:ui-btn-disabled={$indexInProcess}
         >
            <Icon icon="ic:baseline-delete-forever" />
            Erase index
         </button>
      {/if}

      {#if mode == "persist"}
         <span> Saved index: {@html $savedStats}</span>

         <div class="ui-flex ui-flex-row ui-gap-2">
            <button
               class="ui-btn ui-btn-md ui-mt-3 ui-flex ui-gap-2 ui-max-w-1/2"
               on:click={async (_) => {
                  await saveIndex();

                  updateSaved();
               }}
               class:ui-btn-disabled={$indexInProcess}
            >
               <Icon icon="heroicons-solid:save" />
               Save index
            </button>

            <button
               class="ui-btn ui-btn-md ui-mt-3 ui-flex ui-gap-2 ui-max-w-1/2"
               on:click={async (_) => {
                  await clearSavedIndex();
                  updateSaved();
               }}
               class:ui-btn-disabled={$indexInProcess}
            >
               <Icon icon="ic:baseline-delete-forever" />
               Erase index
            </button>
         </div>
      {/if}
   {:else}
      <div class="ui-w-full ui-font-bold ui-text-center ui-m-6">This mode is the Patreon-only feature.</div>

      <div class="ui-w-full ui-font-bold ui-text-center ui-flex ui-items-center ui-justify-center">
         <a href="https://www.patreon.com/averrin" target="_blank">
            <img
               style="border: unset;"
               class="ui-rounded-md"
               width="200px"
               height="50px"
               alt="Become a Patron"
               src="modules/alpha-suit/assets/patreon.svg"
            />
         </a>
      </div>
   {/if}
</div>
