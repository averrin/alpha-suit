<script>
   import { TJSProseMirror } from "@typhonjs-fvtt/svelte-standard/component";
   import { SETTINGS, setting, onHook, calculateValue, logger } from "crew-components/helpers";
   import { tick } from "svelte";
   export let item;

   let result = "";
   let source = item.target;
   let target;

   async function getTarget() {
      if (!source) return;
      target = await fromUuid(source);
      if (!(target instanceof Actor)) {
         target = target.actor;
      }
      // logger.info(target);
   }

   async function process() {
      try {
         await getTarget();
         if (target) {
            result = Handlebars.compile(item.template)(target);
            // logger.info(item.template, result, target);
         } else {
            result = "Target is not found.";
         }
      } catch (e) {
         logger.error(e);
         result = e;
      }
   }

   tick().then(process);
   $: process();

   onHook(["updateActor"], process)
</script>

<!-- {JSON.stringify(item)} -->
<div class="ui-p-1">
   <TJSProseMirror content={result} options={{ editable: false }} />
</div>
