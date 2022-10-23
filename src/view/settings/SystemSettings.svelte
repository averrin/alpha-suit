<script>
   import { SETTINGS } from "../../modules/constants.js";
   import SettingsInput from "./SettingsInput.svelte";
   import { system } from "../../modules/stores.js";
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">Game System Settings</div>

   <div class="ui-input-group ui-input-group-md ui-w-auto">
      <span>System name</span>
      <div
         class="ui-px-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1"
         style="border-color: hsl(var(--b3)); border-style: solid;"
      >
         {globalThis.game.system.data.title}
      </div>
   </div>

   <div class="ui-input-group ui-input-group-md ui-w-auto">
      <span>System supported</span>
      <div
         class="ui-px-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1"
         style="border-color: hsl(var(--b3)); border-style: solid;"
      >
         {#if $system.data.id != "*"}
            <iconify-icon icon="fa:check" style="color: hsl(var(--s))" />
         {:else}
            <iconify-icon icon="fluent-emoji-high-contrast:cross-mark" style="color: hsl(var(--e))" />
         {/if}
      </div>
   </div>

   <SettingsInput key={SETTINGS.SHOW_SPELLS_TAB} />
</div>
