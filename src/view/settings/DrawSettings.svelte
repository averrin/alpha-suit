<script>
   import { SETTINGS } from "../../modules/constants.js";
   import SettingsInput from "./SettingsInput.svelte";
   import { drawMarkers } from "../../modules/stores.js";
   import IconButton from "crew-components/IconButton";
   import RemoveButton from "crew-components/RemoveButton";
   import ArgInput from "crew-components/ArgInput";

   function save() {
      drawMarkers.set($drawMarkers);
   }
   function remove(marker) {
      drawMarkers.update((markers) => {
         return markers.filter((m) => m != marker);
      });
   }
   function add() {
      drawMarkers.update((markers) => {
         return [...markers, {}];
      });
   }
</script>

<div class="ui-bg-base ui-p-2 browser-settings ui-flex ui-flex-col ui-gap-2 ui-h-full">
   <div class="ui-text-center ui-text-base-content ui-text-lg ui-font-bold">Draw Settings</div>

   <SettingsInput key={SETTINGS.DRAW_SHOW_CP} />

   <h1>Markers</h1>
   <div class="ui-flex ui-flex-col ui-items-center ui-gap-2">
      <button class="ui-btn ui-btn-md" on:click={add}>Add</button>
      {#each $drawMarkers as marker (marker.path)}
         <div class="ui-flex ui-flex-row ui-items-center ui-gap-2 ui-w-full">
            <IconButton size="md" icon={marker.path} disabled={true} />
            <ArgInput type="image_file" bind:value={marker.path} on:change={save} />
            <ArgInput type="bool" label="Colorable" bind:value={marker.colored} on:change={save} />
            <RemoveButton size="md" on:click={(_) => remove(marker)} />
         </div>
      {/each}
   </div>
</div>
