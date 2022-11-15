<script>
   import { SETTINGS } from "../../modules/constants.js";
   import SettingsInput from "./SettingsInput.svelte";
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">General Settings</div>

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
   />

   <SettingsInput key={SETTINGS.WINDOW_WIDTH_EXPANDED} />
   <SettingsInput key={SETTINGS.WINDOW_WIDTH_COLLAPSED} />
</div>
