<svelte:options accessors />

<script>
   import { v4 as uuidv4 } from "uuid";
   import AlphaShell from "crew-components/AlphaShell";
   import { onDestroy, tick } from "svelte";
   import InlineButton from "crew-components/InlineButton";

   import { isPremium } from "crew-components/premium";
   import { SETTINGS, setting, onHook, calculateValue, logger } from "crew-components/helpers";
   import RemoveButton from "crew-components/RemoveButton";
   import IconButton from "crew-components/IconButton";
   import { TJSProseMirror } from "@typhonjs-fvtt/svelte-standard/component";
   import ArgInput from "crew-components/ArgInput";
   import InspectButton from "./components/InspectButton.svelte";

   export let elementRoot;
   export let id;

   let content = "HP: {{system.attributes.hp.value}} / {{system.attributes.hp.max}}";
   let result = "";
   let source;
   let target;

   function getTarget() {
      target = calculateValue(source, "token");
      logger.info(target);
   }

   function process() {
      try {
         getTarget();
         result = Handlebars.compile(content)(target.actor);
         logger.info(result);
      } catch (e) {
         result = e;
      }
   }

   tick().then(process);
   $: process();
</script>

<AlphaShell bind:elementRoot {id} fullHeight={true} temp={true}>
   <div class="ui-flex ui-flex-col ui-gap-2 ui-h-full ui-items-stretch">
         <div class="ui-flex ui-flex-row ui-gap-2 ui-items-center ui-p-1"
        style:background-color="hsl(var(--b2))"
      >
            <ArgInput type="token" label="Source token" bind:value={source} on:change={process} />
            <InspectButton item={target?.actor} size="md" />
         </div>

      <div class="ui-flex ui-flex-col ui-h-1/2 ui-p-1">
         <TJSProseMirror
            on:editor:save={(e) => {
               logger.info("editor:save", e);
              process()
            }}
            bind:content
            options={{ editable: true }}
         />
      </div>
      <div class="ui-flex ui-flex-col ui-h-1/2 ui-p-1">
         <h3>Preview</h3>
         <button on:click={process}>update</button>
         <TJSProseMirror content={result} options={{ editable: false }} />
      </div>
   </div>
</AlphaShell>
