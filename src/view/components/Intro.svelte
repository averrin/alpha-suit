<script>
import { isPremium } from "crew-components/premium";

</script>
<div class="ui-mt-16 ui-rounded-md ui-p-2" style="background-color: hsl(var(--b3));">
   <h1 class=" ui-flex ui-flex-row ui-items-center ui-justify-center">
      <iconify-icon style="font-size: 3rem" icon="mdi:alpha" /> Alpha Suit
   </h1>

   <div class="ui-flex ui-gap-2 ui-flex-col ">
      <div class="ui-input-group ui-input-group-md ui-w-auto">
         <span style="background-color: hsl(var(--b2));">Version</span>
         <div
            class="ui-px-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1"
            style="border-color: hsl(var(--b2)); border-style: solid;"
         >
            {globalThis.game.modules.get("alpha-suit").data.version}
         </div>
      </div>

      <div class="ui-input-group ui-input-group-md ui-w-auto">
         <span style="background-color: hsl(var(--b2));">GitHub</span>
         <div
            class="ui-px-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1"
            style="border-color: hsl(var(--b2)); border-style: solid;"
         >
            <a class="ui-link" href="https://github.com/averrin/alpha-suit" target="_blank">averrin/alpha-suit</a>
         </div>
      </div>

      <div class="ui-flex ui-flex-row ui-gap-2 ui-items-center ui-justify-between">
      {#if !isPremium()}
         <a href="https://www.patreon.com/averrin" target="_blank">
            <img
               style="border: unset;"
               class="ui-rounded-md ui-w-full ui-h-full"
               alt="Become a Patron"
               src="modules/alpha-suit/assets/patreon.svg"
            />
         </a>
      {/if}

         <a class="ui-flex" href="https://discord.gg/Nj6UuGZGrC" target="_blank">
            <img
               class="ui-rounded-md ui-border-none"
               src="https://discordapp.com/api/guilds/772596237605011466/widget.png?style=banner2"
            />
         </a>
      </div>
   </div>
</div>
