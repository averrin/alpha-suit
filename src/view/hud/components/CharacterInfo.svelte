<svelte:options accessors={true} />

<script>
   import { matchTrackers, hasResourceIcons, isAlive, findItems } from "../../modules/helpers.js";
   import { moduleId, SETTINGS } from "../../constants.js";
   import { foundry } from "../../modules/foundry.js";
   import NameSegment from "../segments/NameSegment.svelte";
   import CurrencySegment from "../segments/CurrencySegment.svelte";
   import ResourceSegment from "../segments/ResourceSegment.svelte";
   import TrackerSegment from "../segments/TrackerSegment.svelte";
   import WeightSegment from "../segments/WeightSegment.svelte";
   import TokenIcon from "../segments/TokenIcon.svelte";
   import CombatSegment from "../segments/CombatSegment.svelte";
   import AmmoSegment from "../segments/AmmoSegment.svelte";
   import ItemCountSegment from "../segments/ItemCountSegment.svelte";

   import ProgressValueSegment from "../segments/ProgressValueSegment.svelte";
   import DataProgressSegment from "../segments/DataProgressSegment.svelte";
   import { setContext, onDestroy } from "svelte";
   import { writable } from "svelte/store";
   import { targetsStore } from "../../modules/stores.js";

   export let token;
   let owner;
   const tokenStore = writable(token);
   setContext("token", tokenStore);
   $: {
      tokenStore.set(token);
   }

   const users = game.users.filter((u) => u.character == token.document.actor);
   if (users.length > 0) {
      owner = users[0];
   }
   //if (!owner) owner = foundry.user;

   let targets = [];
   const unsubscribe = targetsStore.subscribe((value) => {
      if (owner) targets = Array.from(owner.targets);
   });
   onDestroy(unsubscribe);

   export let hideHP;

   const hpColor = game.settings.get(moduleId, SETTINGS.HP_COLOR);

   const showTargets = foundry.settings.get(moduleId, SETTINGS.SHOW_TARGETS);
   const showExp = foundry.settings.get(moduleId, SETTINGS.SHOW_EXP);
   const showEnc = foundry.settings.get(moduleId, SETTINGS.SHOW_ENC);
   const showCoins = foundry.settings.get(moduleId, SETTINGS.SHOW_COINS);

   const trackers = matchTrackers(token);

   const itemsToFind = globalThis.game.settings.get(moduleId, SETTINGS.ITEM_COUNT_LIST);
   $: items = findItems(token, itemsToFind);
</script>

{#if token}
   <item class="ui-flex ui-flex-col">
      <div class="ui-flex ui-flex-row ui-justify-start ui-items-center ui-h-12 ui-justify-around">
         <div class="cell">
            <NameSegment />
         </div>
         <div class="divider" />
         {#if !hideHP && globalThis.getProperty(token?.document?.actor.getRollData(), "attributes.hp.max") > 0}
            <DataProgressSegment path="attributes.hp" color={hpColor} />
            <div class="divider" />
         {/if}
         {#if showExp}
            <div class="info-container cell">
               <ProgressValueSegment path="details.xp" label="xp" icon="icons/svg/upgrade.svg" />
            </div>
            <div class="divider" />
         {/if}
         {#if showCoins}
            <CurrencySegment />
            <div class="divider" />
         {/if}
         {#if showEnc}
            <WeightSegment />
         {/if}
      </div>
      <div class="ui-flex ui-flex-row ui-justify-start ui-items-center ui-h-12">
         <div class="ui-flex ui-flex-row ui-justify-start ui-items-center ui-h-12 ui-flex-1">
            {#if isAlive(token)}
               <CombatSegment />
               <AmmoSegment />
               <div class="divider" />
            {/if}

            {#each items as item, i}
               <ItemCountSegment {item} />
               <div class="divider" />
            {/each}
            {#if hasResourceIcons(token)}
               <div class="resource-icons">
                  <ResourceSegment iconIndex="1" />
                  <ResourceSegment iconIndex="2" />
                  <ResourceSegment iconIndex="3" />
               </div>
            {/if}
         </div>

         {#if trackers.length > 0}
            <div class="ui-flex ui-flex-row ui-justify-start ui-items-center flex-none">
               {#if hasResourceIcons(token)}
                  <div class="divider" />
               {/if}
               <div class="ui-flex ui-flex-row-reverse">
                  {#each trackers as tracker, i}
                     <TrackerSegment color={tracker.color} label={tracker.label} trackerName={tracker.name} />
                     {#if i != trackers.length - 1}
                        <div class="divider" />
                     {/if}
                  {/each}
               </div>
            </div>
         {/if}
      </div>
      {#if showTargets && targets.length > 0}
         <div class="ui-flex ui-flex-row ui-justify-start ui-items-center ui-h-12">
            <span>Targets:&nbsp;</span>
            {#each targets as target}
               <TokenIcon token={target} player={owner} />
            {/each}
         </div>
      {/if}
   </item>
{/if}
