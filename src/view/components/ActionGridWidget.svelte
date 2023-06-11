<script>
   import ItemThumb from "./ItemThumb.svelte";
   import Tag from "crew-components/Tag";
   import { logger, onHook } from "crew-components/helpers";
   export let action;
   // onHook(["updateActor","updateItem"], _ => {
   //   logger.info(action)
   // })
   logger.info(action);
   let ammo = game.actors.get(action.persist.actorId).items.get(action.selectedAmmoId);
   logger.info(ammo, action.selectedAmmoId);
</script>

<div class="ui-p-1">
   <div class="ui-flex ui-flex-row ui-gap-2 ui-items-center ui-flex-wrap">
      <div class="ui-h-10 ui-w-10">
         <ItemThumb on:click={(_) => action.item.sheet.render(true)} maximize={true} item={action.item} />
      </div>
      <div class="ui-flex ui-flex-col ui-gap-1 ui-justify-center">
         {#if action.ready}
            <div class="ui-flex ui-flex-row ui-gap-1 ui-items-center ui-flex-wrap">
               {#each action.variants as variant (variant.label)}
                  <Tag
                     on:click={(_) => variant.roll()}
                     tag={{ text: variant.label, color: "#3161bb" }}
                     compact={true}
                  />
               {/each}
               <Tag
                  on:click={(_) => action.damage()}
                  tag={{ text: "Damage", icon: "material-symbols:swords", color: "darkred" }}
                  compact={true}
               />
               <Tag
                  on:click={(_) => action.critical()}
                  tag={{ text: "Critical", icon: "fa6-solid:skull", color: "darkred" }}
                  compact={true}
               />
            </div>
         {/if}
         <div class="ui-flex ui-flex-row ui-gap-1 ui-items-center ui-flex-wrap">
            {#each action.auxiliaryActions as variant (variant.label)}
               <Tag
                  on:click={(_) => variant.execute()}
                  tag={{ text: variant.label, color: "#786452" }}
                  compact={true}
               />
            {/each}
         </div>
         {#if action.ready && ammo}
            <div class="ui-flex ui-flex-row ui-gap-1 ui-items-center ui-flex-wrap">
               <div class="ui-h-6 ui-w-6">
                  <ItemThumb on:click={(_) => ammo.sheet.render(true)} maximize={true} item={ammo} />
               </div>
               {ammo.name}
            </div>
         {/if}
      </div>
   </div>
</div>
