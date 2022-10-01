<script>
   import ProgressSegment from "../segments/ProgressSegment.svelte";
   import { getContext, onDestroy } from "svelte";
   export let path;
   export let color = "red";

   let tokenStore = getContext("token");
   let doc;
   let data;

   function updateData(doc) {
      data = getProperty(doc.actor.getRollData(), path);
   }

   const unsub = Hooks.on("updateActor", () => updateData(doc));
   onDestroy((_) => Hooks.off("updateActor", unsub));

   const unsubscribe = tokenStore.subscribe((value) => {
      doc = value;
      if (doc.document) {
         doc = doc.document;
      }
      updateData(doc);
   });
   onDestroy(unsubscribe);
</script>

<ProgressSegment value={data.value} max={data.max} {color} />
