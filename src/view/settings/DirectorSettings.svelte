<script>
   import { SETTINGS } from "../../modules/constants.js";
   import SettingsInput from "./SettingsInput.svelte";

   import { setContext } from "svelte";

   setContext("moduleId", Director.moduleId);
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">Director Settings</div>

   <SettingsInput
      key={SETTINGS.THEME}
      type="select"
      options={[
         { value: "light", label: "Light" },
         { value: "dark", label: "Dark" },
      ]}
   />

   <SettingsInput
      type="float"
      key={SETTINGS.UI_SCALE}
      on:change={(e) => {
         if (e.detail < 0.25 || e.detail > 3) return;
      }}
   />

   <SettingsInput type="float" key={Director.SETTINGS.RESOLUTION} />
   <SettingsInput type="select" key={Director.SETTINGS.MANUAL_MODE} />
   <SettingsInput key={Director.SETTINGS.HIDE_IMPORT} />
</div>
