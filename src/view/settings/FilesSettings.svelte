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
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">File Manager Settings</div>

   <ArgInput
      type="int"
      label="File height [Tiles]"
      value={setting(SETTINGS.FILES_IMAGE_HEIGHT)}
      on:change={(e) => saveSetting(SETTINGS.FILES_IMAGE_HEIGHT, e)}
      size="md"
   />
   <span class="ui-label-text ui-text-xs ui-ml-2">File thumb size for the File Manager in the Tiles mode</span>

   <ArgInput
      type="int"
      label="File height [Preview]"
      value={setting(SETTINGS.FILES_IMAGE_HEIGHT_BIG)}
      on:change={(e) => saveSetting(SETTINGS.FILES_IMAGE_HEIGHT_BIG, e)}
      size="md"
   />
   <span class="ui-label-text ui-text-xs ui-ml-2">File thumb size for the File Manager in the Preview mode</span>

   <ArgInput
      type="int"
      label="Asset grid size"
      value={setting(SETTINGS.FILES_DROP_GRID)}
      on:change={(e) => saveSetting(SETTINGS.FILES_DROP_GRID, e)}
      size="md"
   />
   <span class="ui-label-text ui-text-xs ui-ml-2">Grid size for dropping files from the File Manager</span>

   <ArgInput
      type="bool"
      label="Use thumbs for images"
      value={setting(SETTINGS.FILES_USE_THUMBS)}
      on:change={(e) => saveSetting(SETTINGS.FILES_USE_THUMBS, e)}
      size="md"
   />
   <span class="ui-label-text ui-text-xs ui-ml-2"
      >It should increase performance for big images, but looks clunky for smaller ones</span
   >
</div>
