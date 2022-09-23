<script>
   export let item;
   const data = item.source?.data || item.source?.system;
</script>

<div class="ui-text-xs ui-text-base-content ui-flex ui-flex-row ui-gap-1">
   {#if item.source.type == "equipment" && data.armor.value > 0}
      <div class="ui-text-center">
         <iconify-icon class="ui-text-xs ui-text-base-content" icon="fa-solid:shield-alt" />
         {data.armor.value}
      </div>
      <div class="ui-text-center">|</div>
   {/if}
   {data.price}<span class="ui-font-bold">gp</span>
   <div class="ui-text-center">|</div>
   <div class="ui-w-4 ui-text-center">{data.weight}</div>
</div>
