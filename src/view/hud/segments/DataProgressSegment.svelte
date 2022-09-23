<script>
   import ProgressSegment from "../segments/ProgressSegment.svelte";
   import { getContext, onDestroy } from "svelte";
   export let path;
   export let color = "red";

   let tokenStore = getContext("token");
   let doc;
   let data;
   const unsubscribe = tokenStore.subscribe((value) => {
      doc = value;
      if (doc.document) {
         doc = doc.document;
      }
      data = getProperty(doc.actor.getRollData(), path);
   });
   onDestroy(unsubscribe);
</script>

<ProgressSegment value={data.value} max={data.max} {color} />
