<script>
   export let item;
   let components = item.source?.data?.components;
</script>

<div class="ui-text-xs">
   {#if components}
      {#if components.vocal}
         V
      {/if}

      {#if components.somatic}
         S
      {/if}

      {#if components.material}
         M
      {/if}

      {#if components.concentration}
         <span class="ui-font-bold">C</span>
      {/if}
      |
   {/if}
   {item.source.data.level}
</div>
