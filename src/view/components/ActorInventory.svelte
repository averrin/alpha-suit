<script>
   import { onDestroy } from "svelte";
   export let item;

   let currency;
   let items;
   let features;
   let effects;

   const unsub2 = item.subscribe((i) => {
      currency = null;
      items = null;
      features = null;
      effects = null;
      if (i) {
         currency = game.itempiles.API.getActorCurrencies(i);
         items = game.itempiles.API.getActorItems(i);
         logger.info(i);
         features = i?.actor?.items?.filter((it) => it.type == "feat");
         effects = i?.actor?.effects?.contents;
         logger.info(effects);
      }
   });
   onDestroy(unsub2);

   function previewItem(item) {
      item.sheet.render(true);
   }
</script>

{#if $item && effects && effects.length > 0}
   <div class="ui-input-group">
      <span>Effects</span>
      <div
         class="ui-border ui-flex-wrap ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
      >
         {#each effects as item (item.id)}
            <img
               class="ui-h-8 ui-w-8"
               src={item.data.icon}
               title={item.data.label}
               on:click={(_) => previewItem(item)}
            />
         {/each}
      </div>
   </div>
{/if}

{#if $item && currency.length > 0}
   <div class="ui-input-group ui-input-group-md">
      <span>Currency</span>
      <div
         class="ui-px-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
      >
         {#each currency as cur (cur.name)}
            <img class="ui-h-8 ui-w-8" src={cur.img} title={cur.name} />
            {cur.abbreviation.replace("{#}", cur.quantity)}
         {/each}
      </div>
   </div>
{/if}

{#if $item && items && items.length > 0}
   <div class="ui-input-group">
      <span>Items</span>
      <div
         class="ui-border ui-flex-wrap ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
      >
         {#each items as item (item.id)}
            <img class="ui-h-8 ui-w-8" src={item.img} title={item.name} on:click={(_) => previewItem(item)} />
         {/each}
      </div>
   </div>
{/if}

{#if $item && features && features.length > 0}
   <div class="ui-input-group">
      <span>Features</span>
      <div
         class="ui-border ui-flex-wrap ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
      >
         {#each features as item (item.id)}
            <img class="ui-h-8 ui-w-8" src={item.img} title={item.name} on:click={(_) => previewItem(item)} />
         {/each}
      </div>
   </div>
{/if}

<style lang="scss">
   img {
      border-radius: 0.5rem !important;
   }
</style>
