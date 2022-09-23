<script>
   import { system } from "../../modules/stores.js";
   export let item;
</script>

{#if $system.data?.extraInfo && $system.data?.extraInfo[item.source.type]?.component}
   <div class="ui-flex ui-flex-row ui-gap-1 ui-items-center">
      <svelte:component this={$system.data?.extraInfo[item.source.type]?.component} {item} />
   </div>
{/if}
