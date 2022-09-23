<script>
   import { system } from "../../modules/stores.js";

   import ArgInput from "crew-components/ArgInput";
   import { logger, setting } from "crew-components/helpers";
   import { moduleId, SETTINGS } from "../../modules/constants.js";

   function saveSetting(key, e) {
      logger.info(key, e.detail);
      globalThis.game.settings.set(moduleId, key, e.detail);
   }
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">Game System Settings</div>

   <div class="ui-input-group ui-input-group-md ui-w-auto">
      <span>System name</span>
      <div class="ui-px-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1">
         {globalThis.game.system.data.title}
      </div>
   </div>

   <div class="ui-input-group ui-input-group-md ui-w-auto">
      <span>System supported</span>
      <div class="ui-px-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1">
         {#if $system.data.id != "*"}
            <iconify-icon icon="fa:check" style="color: hsl(var(--s))" />
         {:else}
            <iconify-icon icon="fluent-emoji-high-contrast:cross-mark" style="color: hsl(var(--e))" />
         {/if}
      </div>
   </div>

   <!-- <ArgInput -->
   <!--    type="bool" -->
   <!--    label="Director's widget" -->
   <!--    value={setting(SETTINGS.USE_DIRECTOR_TAGS)} -->
   <!--    on:change={(e) => saveSetting(SETTINGS.USE_DIRECTOR_TAGS, e)} -->
   <!--    size="md" -->
   <!-- /> -->
   <!-- <span class="ui-label-text ui-text-xs ui-ml-2">Sync tag colors between modules. Requires the Director module</span> -->
</div>
