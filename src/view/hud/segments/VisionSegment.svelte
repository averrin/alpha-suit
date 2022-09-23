<script>
   import ToggleSegment from "./ToggleSegment.svelte";
   import { getContext, onDestroy } from "svelte";
   let tokenStore = getContext("token");
   let token;
   let state;
   const unsubscribe = tokenStore.subscribe((value) => {
      token = value;
      state = token.document.vision || token.document.data.vision;
   });
   onDestroy(unsubscribe);

   function toggleVision() {
      token.document.update({ vision: !state });
   }
</script>

<ToggleSegment
   onClick={toggleVision}
   iconOff="url(icons/svg/blind.svg)"
   iconOn="url(icons/svg/eye.svg)"
   value={state}
   title={state ? "Has vision" : "No vision"}
/>
