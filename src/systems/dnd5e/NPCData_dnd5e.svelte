<script>
   export let item;

   function formatCR(cr) {
      if (!cr) return "";
      if (cr == 0.5) return "1/2";
      if (cr == 0.25) return "1/4";
      if (cr == 0.125) return "1/8";
      return cr;
   }
</script>

<div class="ui-text-xs">
   {formatCR(item.source.data?.details?.cr)}
</div>
