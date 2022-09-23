<script>
   import ArgInput from "crew-components/ArgInput";
   import { logger, setting } from "crew-components/helpers";
   import { moduleId, SETTINGS } from "../../modules/constants.js";

   function saveSetting(key, e) {
      logger.info(key, e.detail);
      globalThis.game.settings.set(moduleId, key, e.detail);
   }

   import { getContext } from "svelte";
   const { application } = getContext("external");
   const { scale } = application.position.stores;
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">General Settings</div>

   <ArgInput
      label="UI Theme"
      value={setting(SETTINGS.THEME)}
      on:change={(e) => saveSetting(SETTINGS.THEME, e)}
      spec={{
         control: "select",
         options: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
         ],
      }}
      size="md"
   />

   <ArgInput
      label="UI Scale"
      value={setting(SETTINGS.UI_SCALE)}
      on:change={(e) => {
         if (e.detail < 0.25 || e.detail > 3) return;
         saveSetting(SETTINGS.UI_SCALE, e);
         scale.set(e.detail);
      }}
      type="float"
      size="md"
   />
   <span class="ui-label-text ui-text-xs ui-ml-2"
      >UI scale in range [0.25, 3]. Will preview but requires refresh to apply.</span
   >
</div>
