<script>
   import { SETTINGS } from "../../modules/constants.js";
   import SettingsInput from "./SettingsInput.svelte";

   import { setContext } from "svelte";

   setContext("moduleId", Director.moduleId);
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">Effect Editor Settings</div>

   <SettingsInput key={Director.SETTINGS.DROPPED_TILES_TO_EFFECTS} />
   <SettingsInput key={Director.SETTINGS.PATCH_SEQ_DB_DROP} />

   <SettingsInput key={Director.SETTINGS.CTRL_BLOCK_DIRECTOR} />
   <SettingsInput key={Director.SETTINGS.SHIFT_INSTANT_EFFECT} premium={true} />

   <SettingsInput key={Director.SETTINGS.HIDE_GIZMOS} />
</div>

