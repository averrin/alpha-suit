<script>
   import ItemThumb from "./ItemThumb.svelte";

   import { onDestroy } from "svelte";
   export let item;

   let currency;
   let items;
   let features;
   let effects;
   let spells;

   function updateData(i) {
      currency = null;
      items = null;
      features = null;
      effects = null;
      spells = null;
      if (i) {
         currency = game.itempiles?.API.getActorCurrencies(i);
         items = game.itempiles?.API.getActorItems(i);
         items = items?.sort((a, b) => (b.system?.equipped === a.system?.equipped ? 0 : a.system?.equipped ? -1 : 1));
         features = i?.actor?.items?.filter((it) => it.type == "feat");
         spells = i?.actor?.items?.filter((it) => it.type == "spell");
         spells = spells?.sort((a, b) => a.data?.level - b.data?.level);
         effects = i?.actor?.effects?.contents;
         // logger.info(items);
      }
   }

   const unsub2 = item.subscribe((i) => {
      updateData(i);
   });
   onDestroy(unsub2);

   const unsub = Hooks.on("updateActor", () => updateData($item));
   onDestroy((_) => Hooks.off("updateActor", unsub));

   const unsub1 = Hooks.on("deleteItem", () => updateData($item));
   onDestroy((_) => Hooks.off("deleteItem", unsub1));

   const unsub3 = Hooks.on("createItem", () => updateData($item));
   onDestroy((_) => Hooks.off("createItem", unsub3));

   const unsub4 = Hooks.on("updateItem", () => updateData($item));
   onDestroy((_) => Hooks.off("updateItem", unsub4));

   function previewItem(item) {
      item.sheet.render(true);
   }
</script>

{#if $item && effects && effects.length > 0}
   <div class="ui-input-group">
      <span class="ui-font-bold">Effects</span>
      <div
         class="ui-border ui-flex-wrap ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
      >
         {#each effects as item (item.id)}
            <ItemThumb {item} on:click={(_) => previewItem(item)} />
         {/each}
      </div>
   </div>
{/if}

{#if $item && currency && currency.length > 0}
   <div class="ui-input-group ui-input-group-md">
      <span class="ui-font-bold">Currency</span>
      <div
         class="ui-px-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
      >
         {#each currency as cur (cur.name)}
            <img class="ui-h-8 ui-w-8 !ui-rounded-md" src={cur.img} title={cur.name} />
            {cur.abbreviation.replace("{#}", cur.quantity)}
         {/each}
      </div>
   </div>
{/if}

{#if $item && items && items.length > 0}
   <div class="ui-input-group">
      <span class="ui-font-bold">Items</span>
      <div
         class="ui-border ui-flex-wrap ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
      >
         {#each items as item (item.id)}
            <ItemThumb {item} title={item.data.label} on:click={(_) => previewItem(item)} />
         {/each}
      </div>
   </div>
{/if}

{#if $item && features && features.length > 0}
   <div class="ui-input-group">
      <span class="ui-font-bold">Features</span>
      <div
         class="ui-border ui-flex-wrap ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
      >
         {#each features as item (item.id)}
            <ItemThumb {item} on:click={(_) => previewItem(item)} />
         {/each}
      </div>
   </div>
{/if}

{#if $item && spells && spells.length > 0}
   <div class="ui-input-group">
      <span class="ui-font-bold">Spells</span>
      <div
         class="ui-border ui-flex-wrap ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
      >
         {#each spells as item (item.id)}
            <ItemThumb {item} on:click={(_) => previewItem(item)} />
         {/each}
      </div>
   </div>
{/if}

<style lang="scss">
   img {
      border-radius: 0.5rem !important;
   }
</style>
