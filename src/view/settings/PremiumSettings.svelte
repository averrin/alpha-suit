<script>
   // import { SETTINGS } from "../../modules/constants.js";
   // import SettingsInput from "./SettingsInput.svelte";
   import { isPremium } from "crew-components/premium";
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">Alpha Premium</div>

   <div class="ui-input-group ui-input-group-md ui-w-auto">
      <span>Unlocked</span>
      <div
         class="ui-px-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1"
         style="border-color: hsl(var(--b3)); border-style: solid;"
      >
         {#if isPremium()}
            <iconify-icon icon="fa:check" style="color: hsl(var(--s))" />
         {:else}
            <iconify-icon icon="fluent-emoji-high-contrast:cross-mark" style="color: hsl(var(--e))" />
         {/if}
      </div>
   </div>

   {#if isPremium()}
      <div class="ui-text-xl">Thank you very much for your support!</div>
   {:else}
      <a href="https://www.patreon.com/averrin" target="_blank">
         <img
            style="border: unset;"
            class="ui-rounded-md"
            width="200px"
            height="50px"
            alt="Become a Patron"
            src="modules/alpha-suit/assets/patreon.svg"
         />
      </a>
   {/if}
</div>
