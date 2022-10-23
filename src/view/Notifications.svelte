<svelte:options accessors={true} />

<script>
   export let elementRoot;

   import { setting } from "../modules/settings.js";
   import { moduleId, SETTINGS } from "../modules/constants.js";

   import { onMount } from "svelte";
   import toast, { Toaster } from "svelte-french-toast";

   import { notify } from "../modules/notify.js";

   onMount(() => {
      notify.info("Alpha Suit started!");
   });
</script>

<Toaster bind:this={elementRoot} />
