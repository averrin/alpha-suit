<svelte:options accessors />

<script>
   import { v4 as uuidv4 } from "uuid";
   import AlphaShell from "crew-components/AlphaShell";
   import { onDestroy, tick, createEventDispatcher, getContext } from "svelte";
   import { TJSProseMirror } from "@typhonjs-fvtt/svelte-standard/component";

   import { onHook, logger } from "crew-components/helpers";
   import TextGridWidget from "./components/TextGridWidget.svelte";
   import ArgInput from "crew-components/ArgInput";
   import InspectButton from "./components/InspectButton.svelte";
   import { editingWidget } from "../modules/stores.js";
   import { writable } from "svelte/store";

   export let elementRoot;
   export let id;
   // let content = "HP: {{system.attributes.hp.value}} / {{system.attributes.hp.max}}";
   let content = `Click the "Edit" button to change the text -->`;
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
            target: "#controlled.first",
            template: content,
            type: "text",
            thumb: false,
         },
      };
   } else {
   }

   let textWidget = writable(widget.persist);

   function save() {
      editingWidget.set(widget);
   }

   function process() {
      textWidget.set(widget.persist);
      Hooks.call("updateWidget");
   }

   tick().then(process);
   $: process();
   onHook(["updateActor", "controlToken", "targetToken"], process);

   const types = [
      { name: "Text", type: "text" },
      { name: "Actor Property", type: "template" },
   ];
</script>

<AlphaShell bind:elementRoot {id} fullHeight={true} isTemp={true}>
   <div class="ui-flex ui-flex-row ui-gap-2 ui-items-center ui-p-1" style:background-color="hsl(var(--b2))">
    <ArgInput type="color" bind:value={widget.persist.borderColor} label="Border color" />
    <ArgInput type="int" bind:value={widget.persist.borderWidth} label="Border width" />
    </div>
   <div
      style="background: unset"
      class="ui-justify-center ui-w-full ui-h-8 ui-tabs ui-tabs-boxed ui-flex ui-items-center ui-m-1"
   >
      <div
         class="ui-flex ui-flex-1 ui-flex-row ui-w-full ui-h-full ui-justify-center ui-items-center ui-flex-wrap ui-gap-2"
      >
         {#each types as l (l.type)}
            <a
               class="ui-tab ui-tab-xs ui-text-base-content ui-h-full"
               class:ui-tab-active={l.type == widget.persist.type}
               on:click={(_) => {
                  widget.persist.type = l.type;
                  if (widget.persist.type == "template") {
                     widget.persist.target = "#controlled.first";
                  }
               }}
            >
               {l.name}
            </a>
         {/each}
      </div>
   </div>

   <div class="ui-flex ui-flex-col ui-gap-2 ui-h-full ui-items-stretch">
      {#if widget.persist.type == "template"}
         <div class="ui-flex ui-flex-row ui-gap-2 ui-items-center ui-p-1" style:background-color="hsl(var(--b2))">
            <ArgInput type="actor" label="Source actor" bind:value={widget.persist.target} on:change={process} />
            {#if $textWidget.target && game.modules.get("data-inspector")?.api}
               <InspectButton item={$textWidget.target} size="md" />
            {/if}
            <ArgInput type="bool" bind:value={$textWidget.thumb} label="Show thumb" />
         </div>
      {/if}

      <div class="ui-flex ui-flex-col ui-h-full ui-p-1">
         {#if widget.persist.type == "template"}
            <h3>Template</h3>
         {:else}
            <h3>Text</h3>
         {/if}
         <TJSProseMirror
            on:editor:save={(e) => {
               logger.info("editor:save", e);
               process();
            }}
            bind:content={widget.persist.template}
            options={{ editable: true, saveOnBlur: true }}
         />
      </div>
      {#if widget.persist.type == "template"}
         <div class="ui-flex ui-flex-col ui-h-1/2 ui-p-1">
            <h3>Preview</h3>
            <TextGridWidget item={textWidget} />
         </div>
      {/if}
      <div class="ui-flex ui-flex-row ui-w-full ui-content-between ui-p-2 ui-gap-2">
         <!-- <button class="ui-btn ui-btn-md" style:width="49%" on:click={process}>Update</button> -->
         <button
            class="ui-btn ui-btn-md ui-btn-primary"
            on:click={(_) => {
               save();
               AlphaSuit.closeApp("edit-widget");
            }}>Save</button
         >
      </div>
   </div>
</AlphaShell>
