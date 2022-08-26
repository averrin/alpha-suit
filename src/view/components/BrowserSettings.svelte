<script>
   import ArgInput from "crew-components/ArgInput";
   import { logger, setting } from "crew-components/helpers";
   import { moduleId, SETTINGS } from "../../modules/constants.js";

   function saveSetting(key, e) {
      logger.info(key, e.detail);
      globalThis.game.settings.set(moduleId, key, e.detail);
   }
</script>

<div class="ui-bg-white ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2">
   <div class="ui-text-center ui-text-lg ui-font-bold">Settings</div>
   <ArgInput
      type="bool"
      label="Advanced mode"
      value={setting(SETTINGS.ADVANCED_MODE)}
      on:change={(e) => saveSetting(SETTINGS.ADVANCED_MODE, e)}
   />

   <ArgInput
      type="int"
      label="Page size"
      value={setting(SETTINGS.PAGE_SIZE)}
      on:change={(e) => saveSetting(SETTINGS.PAGE_SIZE, e)}
   />

   <ArgInput
      type="multiselect"
      label="Ignored packs"
      spec={{
         control: "multiselect",
         options: game.packs.contents.map((p) => {
            return { value: `${p.metadata.package}.${p.metadata.name}`, label: p.metadata.label };
         }),
      }}
      value={setting(SETTINGS.IGNORED_PACKS)}
      on:change={(e) => saveSetting(SETTINGS.IGNORED_PACKS, e)}
   />
</div>

<style>
   :global(.browser-settings .arg-input span) {
      min-width: fit-content;
   }
</style>
