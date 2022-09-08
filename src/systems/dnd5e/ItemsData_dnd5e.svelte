<script>
   export let item;
   const data = item.source?.data || item.source?.system;
</script>

<div class="ui-text-xs ui-text-base-content">
   {#if item.source.type == "equipment" && data.armor.value > 0}
      <span class="ui-font-bold">AC:</span>
      {data.armor.value}
      |
   {/if}
   {data.price}<span class="ui-font-bold">gp</span>
   |
   {data.weight}
</div>
