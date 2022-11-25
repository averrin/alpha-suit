<svelte:options accessors={true} />

<script>
   export let elementRoot;

   import { onMount } from "svelte";
   import toast, { Toaster } from "svelte-french-toast";

   import { notify } from "../modules/notify.js";

   onMount(() => {
      notify.info("Alpha Suit started!");
   });
</script>

<Toaster bind:this={elementRoot} />
