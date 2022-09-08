<script>
   export let item;

   const data = item.source?.data || item.source?.system;
</script>

<div class="ui-text-[0.6rem] ui-text-base-content">
   {data.requirements}
</div>
