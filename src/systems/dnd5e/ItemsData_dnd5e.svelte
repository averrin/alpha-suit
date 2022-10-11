<script>
   export let item;
   let data = item.source?.system ?? item.source?.data;

   if (!data.price && data.data) {
      data = data.data;
   }
   const colors = {
      "": "#555",
      common: "#ccc",
      uncommon: "mediumseagreen",
      rare: "cornflowerblue",
      veryRare: "darkviolet",
      legendary: "orange",
   };
</script>

<div class="ui-text-xs ui-text-base-content ui-flex ui-flex-row ui-gap-1 ui-items-center">
   {#if item.source.type == "equipment" && data.armor?.value > 0}
      <div class="ui-text-center">
         <iconify-icon class="ui-text-xs ui-text-base-content" icon="fa-solid:shield-alt" />
         {data.armor.value}
      </div>
      <div class="ui-text-center">|</div>
   {/if}
   {#if data.price}
      <div>
         {data.price}<span class="ui-font-bold">gp</span>
      </div>
   {/if}
   <div
      class="ui-w-3 ui-h-3 ui-rounded-full ui-border"
      style:background-color={colors[data.rarity]}
      title={data.rarity}
   />
   {#if data?.weight}
      <div class="ui-text-center">|</div>
      <div class="ui-w-5 ui-text-center">{data.weight}</div>
   {/if}
</div>
