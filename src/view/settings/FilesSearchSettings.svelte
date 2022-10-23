<script>
   import { SETTINGS } from "../../modules/constants.js";
   import SettingsInput from "./SettingsInput.svelte";
   import Icon from "crew-components/Icon";
   import {
      fileIndex,
      indexInProcess,
      rebuildIndex,
      indexPath,
      indexPercents,
      stopFileIndex,
   } from "../../modules/file_index.js";
   import IndexStatus from "../components/IndexStatus.svelte";

   let storages = [...globalThis.game.data.files.storages];

   if (location.host.includes("forge-vtt")) {
      storages.push("forge-bazaar", "forgevtt");
   }
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">File Manager Settings</div>

   <SettingsInput key={SETTINGS.FILES_DISABLE_SEARCH} />
   <SettingsInput key={SETTINGS.FILES_INDEX_DELAY} />
   <SettingsInput key={SETTINGS.FILES_SHOW_INDEX_STATUS} premium={true} />

   <SettingsInput key={SETTINGS.FILES_DEPTH_LIMIT} />
   <SettingsInput key={SETTINGS.FILES_INDEX_COUNT} />

   <SettingsInput key={SETTINGS.FILES_EXCLUDE_SOURCES} type="multiselect" options={storages} />

   <SettingsInput key={SETTINGS.FILES_EXCLUDE_FOLDERS} type="multiselect" onlyAutocomplete={false} />

   <SettingsInput key={SETTINGS.FILES_INDEX_ONLY_ASSETS} />

   <div class="ui-flex ui-flex-row ui-gap-2">
      <button
         class="ui-btn ui-btn-primary ui-btn-md ui-mt-3 ui-flex ui-gap-2"
         style:max-width={!$indexInProcess ? "100%" : "50%"}
         on:click={rebuildIndex}
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
   {#if $fileIndex.length > 0}
      <button
         class="ui-btn ui-btn-md ui-mt-3 ui-flex ui-gap-2"
         on:click={(_) => fileIndex.set([])}
         class:ui-btn-disabled={$indexInProcess}
      >
         <Icon icon="ic:baseline-delete-forever" />
         Erase index
      </button>
   {/if}
</div>
