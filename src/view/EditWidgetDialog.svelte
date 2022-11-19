<svelte:options accessors />

<script>
   import { v4 as uuidv4 } from "uuid";
   import AlphaShell from "crew-components/AlphaShell";
   import { onDestroy, tick } from "svelte";
   import InlineButton from "crew-components/InlineButton";

   import { isPremium } from "crew-components/premium";
   import { SETTINGS, setting, onHook } from "crew-components/helpers";
   import RemoveButton from "crew-components/RemoveButton";
   import IconButton from "crew-components/IconButton";

   export let elementRoot;
   export let id;

</script>

<AlphaShell bind:elementRoot {id} fullHeight={true} temp={true}>
  boom
</AlphaShell>

