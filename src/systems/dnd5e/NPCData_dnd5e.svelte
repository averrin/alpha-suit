<script>
   export let item;

   function formatCR(cr) {
      if (!cr) return "";
      if (parseFloat(cr) == 0.5) return "1/2";
      if (parseFloat(cr) == 0.25) return "1/4";
      if (parseFloat(cr) == 0.125) return "1/8";
      return cr;
   }

   let data = item.source?.data || item.source?.system;
   if (!data.details) {
      data = data.data;
   }
</script>

{#if data?.details?.cr}
   <div class="ui-text-xs ui-text-base-content ui-flex ui-flex-row ui-gap-1 ui-items-center ui-whitespace-nowrap">
      {formatCR(data?.details?.cr)}
      |

      {#if data.attributes.ac.flat}
         <iconify-icon class="ui-text-xs ui-text-base-content" icon="fa-solid:shield-alt" />
         {data.attributes.ac.flat}
         |
      {/if}

      {#if data.attributes.hp.value}
         <iconify-icon class="ui-text-xs ui-text-base-content" icon="fa-solid:heart" />
         {data.attributes.hp.value}
      {/if}
   </div>
{/if}
