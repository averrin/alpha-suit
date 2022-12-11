<script>
   import SettingsInput from "./SettingsInput.svelte";
   import { SETTINGS } from "../../modules/constants.js";
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">Tools</div>

   <SettingsInput key={SETTINGS.TOOLS_TREE} />
   <SettingsInput key={SETTINGS.TOOLS_BROWSER} />
   <SettingsInput key={SETTINGS.TOOLS_FILES} />
   <SettingsInput key={SETTINGS.TOOLS_SETTINGS} />
   <SettingsInput key={SETTINGS.TOOLS_HELP} />
   <SettingsInput key={SETTINGS.TOOLS_GRID} />
   <!-- <SettingsInput key={SETTINGS.TOOLS_CREATOR} /> -->

   <p>These settings require page reloading.</p>
</div>
