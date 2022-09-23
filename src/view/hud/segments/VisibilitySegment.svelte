<script>
   import ToggleSegment from "./ToggleSegment.svelte";
   import { getContext, onDestroy } from "svelte";
   let tokenStore = getContext("token");
   let token;
   let state;
   const unsubscribe = tokenStore.subscribe((value) => {
      token = value;
      state = token.document.hidden || token.document.data.hidden;
   });
   onDestroy(unsubscribe);

   function toggleVisibility() {
      token.document.update({ hidden: !state });
   }
</script>

<ToggleSegment
   onClick={toggleVisibility}
   iconOff="url(icons/svg/ice-aura.svg)"
   iconOn="url(icons/svg/cowled.svg)"
   value={state}
   title={state ? "Hidden" : "Visible"}
/>
