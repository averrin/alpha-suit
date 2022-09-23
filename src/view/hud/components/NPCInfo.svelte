<svelte:options accessors={true} />

<script>
   import { moduleId, SETTINGS } from "../../../modules/constants.js";
   import { isAlive } from "../helpers.js";

   import NameSegment from "../segments/NameSegment.svelte";
   import VisionSegment from "../segments/VisionSegment.svelte";
   import VisibilitySegment from "../segments/VisibilitySegment.svelte";
   import AliveSegment from "../segments/AliveSegment.svelte";
   import CombatSegment from "../segments/CombatSegment.svelte";
   import ItemIconSegment from "../segments/ItemIconSegment.svelte";
   import PileSegment from "../segments/PileSegment.svelte";
   import DataProgressSegment from "../segments/DataProgressSegment.svelte";
   import TokenIcon from "../segments/TokenIcon.svelte";
   import CurrencySegment from "../segments/CurrencySegment.svelte";
   import NPCLevelSegment from "../segments/NPCLevelSegment.svelte";
   import ActionsSegment from "../segments/ActionsSegment.svelte";

   import { setContext, onDestroy } from "svelte";
   import { writable } from "svelte/store";
   import { targetsStore } from "../../../modules/stores.js";

   const itemsToFind = globalThis.game.settings.get(moduleId, SETTINGS.ITEM_DETECT_LIST);
   const hasPiles = typeof window.ItemPiles !== "undefined";
   const hpColor = game.settings.get(moduleId, SETTINGS.HP_COLOR);
   const showTargets = globalThis.game.settings.get(moduleId, SETTINGS.SHOW_TARGETS);
   const showActions = typeof game.tokenActionHUD !== "undefined" && game.settings.get(moduleId, SETTINGS.SHOW_ACTIONS);

   let targets;
   const unsubscribe = targetsStore.subscribe((value) => {
      targets = Array.from(value);
   });
   onDestroy(unsubscribe);

   export let hideHP;
   export let token;
   let onlySelected;
   let tags;
   const tokenStore = writable(token);
   setContext("token", tokenStore);
   $: tokenStore.set(token);
   $: items = token?.document?.actor?.items.filter((i) => itemsToFind.some((itf) => itf == i.name));
   $: onlySelected = globalThis.canvas.tokens.controlled.length == 1;
   $: if (globalThis.Tagger) tags = Tagger.getTags(token).filter((t) => t != "");
   let tagSpecs = [];
   if (globalThis.Director) {
      tagSpecs = globalThis.game.settings.get("director", "tags");
   }

   let owner = globalThis.game.user;

   function contrastColor(color) {
      if (!color || color == "") return "#000000";
      const pRed = 0.299;
      const pGreen = 0.587;
      const pBlue = 0.114;
      const rgb = foundry.utils.hexToRGB(parseInt(color.slice(1), 16));

      const contrast = Math.sqrt(pRed * rgb[0] ** 2 + pGreen * rgb[1] ** 2 + pBlue * rgb[2] ** 2);

      return contrast > 1 ? "#000000" : "#ffffff";
   }
</script>

{#if token}
   <item>
      <div class="ui-flex ui-flex-row ui-justify-start ui-items-center ui-h-8">
         <NameSegment />
         <div class="divider" />
         {#if !hideHP && globalThis.getProperty(token?.document?.actor.getRollData(), "attributes.hp.max") > 0}
            <DataProgressSegment path={"attributes.hp"} color={hpColor} />
            <div class="divider" />
         {/if}
         <div>
            <AliveSegment />
            {#if isAlive(token)}
               <VisionSegment />
               <VisibilitySegment />
               <CombatSegment />
            {/if}
            {#if hasPiles && !isAlive(token)}
               <PileSegment />
            {/if}
         </div>
      </div>
      <div class="ui-flex ui-flex-row ui-justify-start ui-items-center ui-h-10 ui-ml-2">
         {#if isAlive(token)}
            <NPCLevelSegment />
            {#if (showActions && onlySelected) || items.length > 0}
               <div class="divider" />
            {/if}
            {#if showActions && onlySelected}
               <ActionsSegment />
            {/if}
            {#if items.length > 0}
               {#if showActions && onlySelected}
                  <span> * </span>
               {/if}
               <span class="button-group">
                  {#each items as item}
                     <ItemIconSegment {item} />
                  {/each}
               </span>
            {/if}
            {#if showTargets && targets.length > 0}
               {#if (showActions && onlySelected) || items.length > 0}
                  <div class="divider" />
               {/if}
               <div class="target-icons">
                  {#each targets as target}
                     <TokenIcon token={target} player={owner} />
                  {/each}
               </div>
               <div class="divider" />
            {/if}
         {:else}
            <div class="cell">
               <CurrencySegment />
            </div>
         {/if}
      </div>
      {#if tags && globalThis.Director}
         {#if tags.length > 0}
            <div class="tags-row ui-flex ui-flex-row ui-gap-2 ui-h-10">
               {#each tags as tag}
                  <span
                     class="tag ui-flex ui-items-center"
                     style:background-color={tagSpecs.find((t) => t.text == tag)?.color}
                     style:color={contrastColor(tagSpecs.find((t) => t.text == tag)?.color)}
                  >
                     {#if tagSpecs.find((t) => t.text == tag)?.icon}
                        <iconify-icon
                           style:font-size="1.5rem"
                           style:margin-right="0.5rem"
                           icon={tagSpecs.find((t) => t.text == tag)?.icon}
                           style:color={contrastColor(tagSpecs.find((t) => t.text == tag)?.color)}
                        />
                     {/if}

                     {tag}
                  </span>
               {/each}
            </div>
         {/if}
      {/if}
   </item>
{/if}

<style>
   .tag {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans",
         "Droid Sans", "Helvetica Neue", sans-serif;
      font-size: 1.2rem;
      padding: 2px 5px;

      display: flex;
      white-space: nowrap;
      list-style: none;
      color: #242424;
      background: #fff;
      margin-right: 5px;
      margin-top: 5px;
      border-radius: 6px;
      font-weight: bold;
      padding: 2px 8px;
      height: unset !important;
      text-shadow: none !important;
   }
</style>
