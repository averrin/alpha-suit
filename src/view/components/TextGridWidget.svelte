<script>
   import { TJSProseMirror } from "@typhonjs-fvtt/svelte-standard/component";
   import { SETTINGS, setting, onHook, calculateValue, logger } from "crew-components/helpers";
   import { tick } from "svelte";
   import { writable } from "svelte/store";
   import DocumentThumb from "./DocumentThumb.svelte";
   export let item;
   let _item;
   let target;
   const st = writable(target);
   let result = "";

   function getTarget() {
      logger.info(_item);
      if (_item.type == "text") {
         target = null;
         _item.target = null;
         st.set(target);
         return;
      }
      if (!_item.target) return;
      try {
         target = calculateValue(_item.target, "actor");
         if (!(target instanceof Actor)) {
            target = target.actor;
         }
         st.set(target);
      } catch (e) {
         result = e;
      }
   }

   function process() {
      try {
         getTarget();
         if (target) {
            let template = _item.template;
            template = template.replaceAll(new RegExp(/{[\t]*@/g), "{system.");
            result = Handlebars.compile(template)({ ...target, actor: target });
         } else if (_item.target) {
            // logger.error(_item);
            result = "Target is not found.";
         } else {
            result = _item.template;
         }
      } catch (e) {
         // logger.error(e);
         result = e;
      }
   }

   item.subscribe((i) => {
      // debugger;
      _item = i;
      if (_item.persist) {
         _item = _item.persist;
      }
      process();
   });
   $: process();

   onHook(["updateActor", "controlToken", "targetToken", "updateWidget"], process);

   function thumbClick() {
     target.sheet.render(true)
   }
</script>

<div class="ui-p-1 ui-flex-row ui-items-center ui-flex ui-gap-2">
   {#if _item.thumb && $st && _item.target}
      <div class="ui-min-w-10 ui-min-h-10 ui-h-10 ui-w-10">
         <DocumentThumb on:click={thumbClick} item={st} maximize={true} />
      </div>
   {/if}
   <TJSProseMirror content={result} options={{ editable: false }} />
</div>
