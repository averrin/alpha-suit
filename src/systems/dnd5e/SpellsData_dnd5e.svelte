<script>
   export let item;
   const data = item.source?.data || item.source?.system;
   let components = data?.components;
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
   {data.level}
</div>
