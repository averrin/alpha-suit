<script>
   import { getContext, onDestroy } from "svelte";
   let tokenStore = getContext("token");
   let doc;
   let data;
   export let format;
   export let path;
   export let color = "";

   function updateData(doc) {
      data = globalThis.getProperty(doc.actor.getRollData(), path);
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

<span style={color != "" ? `color: ${color};` : ""} class="ui-text-base-content">
   {format ? format(data) : data}
</span>
