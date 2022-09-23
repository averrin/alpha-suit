<script>
   // TODO: extract strings to constants
   import { currentSystemProvider } from "../../modules/api.js";
   import { foundry } from "../../modules/foundry.js";
   import { moduleId, SETTINGS } from "../../constants.js";
   import { getContext, onDestroy } from "svelte";
   let tokenStore = getContext("token");
   let token;
   let doc;
   const unsubscribe = tokenStore.subscribe((value) => {
      token = value;
      doc = token;
      if (doc.document) {
         doc = doc.document;
      }
   });
   onDestroy(unsubscribe);

   let data;
   let hasEnc;
   const icon = "icons/svg/item-bag.svg";
   let color = "";
   let value;
   let max;
   function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }

   $: {
      data = doc.actor.getRollData();
      hasEnc = globalThis.getProperty(data, "attributes.encumbrance");

      const enc_colors = {
         0: "lightgreen",
      };

      const veIntegration = foundry.settings.get(moduleId, SETTINGS.VE_INTEGRATION);
      const VE = game.modules.get("variant-encumbrance-dnd5e");
      if (hasEnc) {
         (async () => {
            if (veIntegration && VE && VE.api) {
               await delay(1000); //hack for VE update
               data = VE.api.calculateWeightOnActorFromId(doc.actor.id);
               data.max = data.heavyMax;
               data.value = data.totalWeight;
            } else {
               await delay(1000); //hack for VE update
               data = currentSystemProvider.getEncumberance(doc.actor);
            }

            enc_colors[data.lightMax] = "yellow";
            enc_colors[data.mediumMax] = "orange";

            for (const [key, v] of Object.entries(enc_colors)) {
               if (data.value >= key) {
                  color = v;
               }
            }

            if (data.value > data.max) {
               color = "red";
            } else if (data.value == 0) {
               color = "grey";
            }
            value = data.value;
            max = data.max;
         })();
      }
   }
</script>

{#if hasEnc && value}
   <span class="data-segment" title="{Math.round((value / max) * 100)}%, left: {max - value}">
      <span class="icon" style="background-image: url({icon})" />
      <span>
         <span style={color != "" ? `color: ${color};` : ""}>{value}</span>
         /
         <span>{max}</span>
      </span>
   </span>
{/if}

<style lang="scss">
   .data-segment {
      display: flex;
      flex-direction: row;
      align-items: center;
   }
</style>
