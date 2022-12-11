<svelte:options accessors={true} />

<script>
   import AlphaShell from "crew-components/AlphaShell";
   import { SETTINGS } from "crew-components/helpers";
   import SettingsInput from "./settings/SettingsInput.svelte";
   export let elementRoot;
</script>

<AlphaShell bind:elementRoot id="trial" scrollable={true}>
   <div class="ui-p-4">
      <div style:font-size="2rem" class="ui-font-bold ui-p-2 ui-w-full ui-text-center">Merry Christmas and the Happy New Year!</div>

      <div class="ui-flex ui-w-full ui-items-center ui-justify-center">
         <img alt="Santa" class="ui-border-none" src="modules/alpha-suit/assets/Dwarf_Santa_A.png" />
      </div>

      <div class="ui-text-lg ui-p-2 ui-w-full">
         <p>
            Long winter nights are the best time to play TTRPGs! And I want to celebrate this time with you. So, this is
            my present for you: all the premium features are <b style:color="green">free until 1 January</b>.
         </p>
         <p>
            I hope you find something for yourself. If you want to continue using one of the premium features for more
            time, you can always subscribe to my Patreon.
         </p>
      </div>

   <div class="ui-flex ui-w-full ui-items-center ui-justify-center">
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
   </div>
   </div>

    <div class="ui-w-full ui-p-1" style:background-color="hsl(var(--b2))">
    <SettingsInput key={SETTINGS.HIDE_TRIAL_2023} />
    </div>
</AlphaShell>
