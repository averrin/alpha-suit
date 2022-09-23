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
   <div class="ui-text-xs ui-text-base-content ui-font-bold ui-text-center ui-w-4 ui-mx-1">
      {formatCR(data?.details?.cr)}
   </div>
{/if}
