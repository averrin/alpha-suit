<svelte:options accessors />

<script>
   import { v4 as uuidv4 } from "uuid";
   import AlphaShell from "crew-components/AlphaShell";
   import { onDestroy, tick, createEventDispatcher, getContext } from "svelte";
   import InlineButton from "crew-components/InlineButton";
   import { TJSProseMirror } from "@typhonjs-fvtt/svelte-standard/component";

   import { isPremium } from "crew-components/premium";
   import { SETTINGS, setting, onHook, calculateValue, logger } from "crew-components/helpers";
   import RemoveButton from "crew-components/RemoveButton";
   import IconButton from "crew-components/IconButton";
   import TextGridWidget from "./components/TextGridWidget.svelte";
   import ArgInput from "crew-components/ArgInput";
   import InspectButton from "./components/InspectButton.svelte";
   import { editingWidget } from "../modules/stores.js";

   export let elementRoot;
   export let id;
   let content = "HP: {{system.attributes.hp.value}} / {{system.attributes.hp.max}}";
   let widget = $editingWidget;
   if (!widget) {
      widget = {
         1: {
            h: 1,
            w: 4,
            x: 0,
            y: 0,
         },
         type: "Text",
         widgetId: uuidv4(),
         persist: {
            target: undefined,
            template: content,
         },
      };
   }

   let result = "";
   let source;
   let target;

   function save() {
      editingWidget.set(widget);
   }

   function getTarget() {
      target = calculateValue(source, "actor");
      widget.persist.target = target?.uuid;
      widget = { ...widget };
   }

   function process() {
      try {
         getTarget();
         result = Handlebars.compile(widget.persist.template)(target);
         // logger.info(widget.persist.template, result);
         save();
      } catch (e) {
         logger.error(e);
         result = e;
      }
   }

   tick().then(process);
   $: process();
</script>

<AlphaShell bind:elementRoot {id} fullHeight={true} isTemp={true}>
   <div class="ui-flex ui-flex-col ui-gap-2 ui-h-full ui-items-stretch">
      <div class="ui-flex ui-flex-row ui-gap-2 ui-items-center ui-p-1" style:background-color="hsl(var(--b2))">
         <ArgInput type="actor" label="Source actor" bind:value={source} on:change={process} />
         <InspectButton item={target} size="md" />
      </div>

      <div class="ui-flex ui-flex-col ui-h-1/2 ui-p-1">
         <h3>Template</h3>
         <TJSProseMirror
            on:editor:save={(e) => {
               logger.info("editor:save", e);
               process();
            }}
            bind:content={widget.persist.template}
            options={{ editable: true }}
         />
      </div>
      <div class="ui-flex ui-flex-col ui-h-1/2 ui-p-1">
         <h3>Preview</h3>
         <TextGridWidget item={widget.persist} />
      </div>
      <div class="ui-flex ui-flex-row ui-w-full ui-content-between ui-p-2 ui-gap-2">
         <button class="ui-btn ui-btn-md" style:width="49%" on:click={process}>Update</button>
         <button
            class="ui-btn ui-btn-md ui-btn-primary"
            style:width="49%"
            on:click={(_) => {
               save();
              AlphaSuit.closeApp("edit-widget")
            }}>Save</button
         >
      </div>
   </div>
</AlphaShell>
