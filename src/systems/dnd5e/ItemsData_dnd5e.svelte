<script>
   export let item;
</script>

<div class="ui-text-xs">
   {#if item.source.type == "equipment"}
      <span class="ui-font-bold">AC:</span>
      {item.source.data.armor.value}
      |
   {/if}
   {item.source.data.price}<span class="ui-font-bold">gp</span>
   |
   {item.source.data.weight}
</div>
