<script>
   import { SETTINGS } from "../../modules/constants.js";
   import SettingsInput from "./SettingsInput.svelte";

   let storages = globalThis.game.data.files.storages;

   if (location.host.includes("forge-vtt")) {
      storages.push("forge-bazaar", "forgevtt");
   }
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">File Manager Settings</div>

   <SettingsInput key={SETTINGS.FILES_IMAGE_HEIGHT} />
   <SettingsInput key={SETTINGS.FILES_IMAGE_HEIGHT_BIG} />

   <SettingsInput key={SETTINGS.FILES_DROP_GRID} />
   <SettingsInput key={SETTINGS.FILES_USE_THUMBS} />
   <SettingsInput key={SETTINGS.FILES_SEARCH_LIMIT} />
</div>
