<svelte:options accessors={true} />

<script>
   import AlphaShell from "crew-components/AlphaShell";
   import { onDestroy, getContext } from "svelte";
   export let paddingTop = 30;
   export let left = 30;
   export let right = 70;

   const { application } = getContext("external");
   const position = application.position;
   const { height } = position.stores;
   let contentH = $height;
   onDestroy(height.subscribe((h) => (contentH = h - paddingTop)));

   export let elementRoot;
   export let id;
</script>

<AlphaShell bind:elementRoot {id}>
   <slot name="top" />
   <div class="ui-flex ui-flex-row ui-gap-2">
      <div class="ui-bg-base-100 ui-flex-col ui-flex" style="width: {left}%; height: {contentH}px;">
         <div class="ui-h-full ui-overflow-y-auto">
            <slot name="left" />
         </div>
      </div>
      <div class="ui-bg-base-100 ui-flex-col ui-flex" style="width: {right}%; height: {contentH}px;">
         <div class="ui-h-full ui-overflow-y-auto ui-p-2">
            <slot name="right" />
         </div>
         <slot name="right-bottom" />
      </div>
   </div>
</AlphaShell>
