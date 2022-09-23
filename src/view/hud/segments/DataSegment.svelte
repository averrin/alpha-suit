<script>
   import { getContext, onDestroy } from "svelte";
   let tokenStore = getContext("token");
   let doc;
   let data;
   export let format;
   export let path;
   export let color = "";
   const unsubscribe = tokenStore.subscribe((value) => {
      doc = value;
      if (doc.document) {
         doc = doc.document;
      }
      data = globalThis.getProperty(doc.actor.getRollData(), path);
   });
   onDestroy(unsubscribe);
</script>

<span style={color != "" ? `color: ${color};` : ""} class="ui-text-base-content">
   {format ? format(data) : data}
</span>
