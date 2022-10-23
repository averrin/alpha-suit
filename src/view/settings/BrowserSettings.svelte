<script>
   import SettingsInput from "./SettingsInput.svelte";
   import { SETTINGS } from "../../modules/constants.js";
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">Browser Settings</div>
   <SettingsInput key={SETTINGS.ADVANCED_MODE} />
   <SettingsInput key={SETTINGS.PAGE_SIZE} />

   <SettingsInput
      key={SETTINGS.IGNORED_PACKS}
      type="multiselect"
      options={globalThis.game.packs.contents.map((p) => {
         return { value: `${p.metadata.package}.${p.metadata.name}`, label: p.metadata.label };
      })}
   />
</div>

<style>
   :global(.browser-settings .arg-input span) {
      min-width: fit-content;
   }
</style>
