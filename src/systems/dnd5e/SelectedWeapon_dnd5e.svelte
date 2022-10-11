<script>
   import { onDestroy } from "svelte";
   import SelectedItem from "./SelectedItem_dnd5e.svelte";

   export let item;
   let data;

   onDestroy(
      item.subscribe((i) => {
         if (!i) {
            data = null;
            return;
         }
         data = i?.system || i?.data?.data || i?.data;
      })
   );
</script>

{#if data}
   <SelectedItem {item} />
{/if}
