<svelte:options accessors={true} />

<script>
   import { theme } from "../modules/stores.js";
   import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
   import { getContext, onDestroy } from "svelte";
   import { setting } from "crew-components/helpers";

   export let elementRoot;
   export let id;

   const { application } = getContext("external");
   // debugger;
   $: {
      if (elementRoot) {
         elementRoot.classList.add("alpha-ui");
         elementRoot.classList.add("alpha-" + id);
         elementRoot.dataset["theme"] = $theme;
      }
   }
   const position = application.position;
   const { left, top } = position.stores;

   const key = "position-" + id;

   const pos = setting(key);
   left.set(pos.x);
   top.set(pos.y);

   onDestroy(
      left.subscribe((l) => {
         if (!l) return;
         const pos = setting(key);
         pos.x = l;
         setting(key, { x: l, y: pos.y });
      })
   );

   onDestroy(
      top.subscribe((t) => {
         if (!t) return;
         const pos = setting(key);
         pos.y = t;
         setting(key, { y: t, x: pos.x });
      })
   );
</script>

<ApplicationShell bind:elementRoot>
   <main class="alpha-ui ui-flex ui-flex-col ui-container ui-text-base-content" data-theme={$theme}>
      <slot />
   </main>
</ApplicationShell>
