<script>
   import ArgInput from "crew-components/ArgInput";
   import { logger, setting } from "crew-components/helpers";
   import { moduleId, SETTINGS } from "../../modules/constants.js";

   function saveSetting(key, e) {
      logger.info(key, e.detail);
      globalThis.game.settings.set(moduleId, key, e.detail);
   }
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">Tree Settings</div>

   <ArgInput
      type="bool"
      label="Use Director's tags"
      value={setting(SETTINGS.USE_DIRECTOR_TAGS)}
      on:change={(e) => saveSetting(SETTINGS.USE_DIRECTOR_TAGS, e)}
      size="md"
   />
   <span class="ui-label-text ui-text-xs ui-ml-2">Sync tag colors between modules. Requires the Director module</span>

   <ArgInput
      type="bool"
      label="Invert clicks in the Tree"
      value={setting(SETTINGS.INVERT_CLICKS)}
      on:change={(e) => saveSetting(SETTINGS.INVERT_CLICKS, e)}
      size="md"
   />
   <span class="ui-label-text ui-text-xs ui-ml-2">Disabled: left-click for select, right for open builtin sheet</span>
</div>
