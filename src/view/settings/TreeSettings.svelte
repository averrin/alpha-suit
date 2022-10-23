<script>
   import { SETTINGS } from "../../modules/constants.js";
   import SettingsInput from "./SettingsInput.svelte";
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">Tree Settings</div>

   <SettingsInput key={SETTINGS.USE_DIRECTOR_TAGS} />
   <SettingsInput key={SETTINGS.INVERT_CLICKS} />
   <SettingsInput key={SETTINGS.SHOW_SYSTEM_INFO} />
</div>
