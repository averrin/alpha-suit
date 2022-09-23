<svelte:options accessors={true} />

<script>
   export let elementRoot;
   import "./style.scss";
   import { moduleId, SETTINGS } from "../../modules/constants.js";
   import { applyPosition, draggable } from "@typhonjs-fvtt/runtime/svelte/action";

   import { getContext } from "svelte";
   const { application } = getContext("external");
   const position = application.position;
   position.scale = game.settings.get(moduleId, SETTINGS.UI_SCALE);
   export let settingStore;
   export let widgetId;
   const storePosition = foundry.utils.debounce((data) => ($settingStore = data), 500);
   $: storePosition($position);
</script>

<div
   class="alpha-widget ui-flex ui-flex-col ui-gap-3 ui-p-1 ui-rounded"
   id={widgetId}
   bind:this={elementRoot}
   use:applyPosition={position}
   use:draggable={{ position }}
>
   <slot />
</div>
