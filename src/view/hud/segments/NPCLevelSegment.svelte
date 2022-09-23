<script>
   import { currentSystemProvider } from "../../modules/api.js";
   import { getContext, onDestroy } from "svelte";
   let tokenStore = getContext("token");
   let token;
   let doc;
   const unsubscribe = tokenStore.subscribe((value) => {
      token = value;
      doc = token;
      if (doc.document) {
         doc = doc.document;
      }
      data = currentSystemProvider.getNPCLevel(doc.actor);
   });
   onDestroy(unsubscribe);
</script>

<span class="level-segment">
   {data.label}: {data.value}
</span>
