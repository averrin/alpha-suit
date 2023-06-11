<script>
   import { SETTINGS } from "../../modules/constants.js";
   import SettingsInput from "./SettingsInput.svelte";
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">Grid Settings</div>

   <SettingsInput key={SETTINGS.GRID_FOR_PLAYERS} />

   <SettingsInput key={SETTINGS.GRID_IN_SIDEBAR} premium={true} />
   <SettingsInput key={SETTINGS.GRID_IN_TREE} premium={true} />
</div>
