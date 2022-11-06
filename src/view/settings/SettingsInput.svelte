<script>
   import ArgInput from "crew-components/ArgInput";
   import { capitalize, logger } from "crew-components/helpers";
   import { moduleId, SETTINGS } from "../../modules/constants.js";
   import { isPremium } from "crew-components/premium";
   import { createEventDispatcher, getContext } from "svelte";
   const dispatch = createEventDispatcher();

   export let key;
   export let type;
   export let label;
   export let hint;
   export let defaultValue;
   export let options;
   export let onlyAutocomplete = true;
   export let premium = false;

   let mid = getContext("moduleId") ?? moduleId;

   function saveSetting(key, e) {
      if (premium && !isPremium()) return;
      logger.info(key, e.detail);
      globalThis.game.settings.set(mid, key, e.detail);
      dispatch("change", { key, value: e.detail });
   }

   let settingSpec = game.settings.settings.get(`${mid}.${key}`);
   if (!type) {
      if (settingSpec.type === Boolean) {
         type = "bool";
      }
      if (settingSpec.type === Number) {
         type = "int";
      }
      if (settingSpec.type === String) {
         type = "string";
      }
      if (!type) {
         logger.error("Please specify settings input type", key);
      }
   }

   if (!label) {
      label = settingSpec.name;
   }

   if (!hint) {
      hint = settingSpec.hint;
   }
   if (defaultValue === undefined) {
      defaultValue = settingSpec.default;
   }

   let spec;
   if (type == "multiselect") {
      if (options?.length > 0) {
         if (typeof options[0] !== "object") {
            options =
               options?.map((o) => {
                  return { value: o, label: capitalize(o) };
               }) ?? [];
         }
      }
      spec = {
         control: "multiselect",
         options,
      };
   } else if (type == "select") {
      if (settingSpec.choices) {
         options = Object.entries(settingSpec.choices).map((pair) => {
            return { value: pair[0], label: pair[1] };
         });
      }
      spec = {
         control: "select",
         options,
      };
   }
   let value = globalThis.game.settings.get(mid, key);
</script>

<ArgInput
   icon={settingSpec.scope == "world" ? "el:globe" : null}
   {type}
   {label}
   {spec}
   {onlyAutocomplete}
   resettable={true}
   bind:value
   {defaultValue}
   on:change={(e) => saveSetting(key, e)}
   size="md"
   heightAuto={key == SETTINGS.FILES_EXCLUDE_FOLDERS}
   disabled={premium && !isPremium()}
   min={settingSpec.range?.min}
   max={settingSpec.range?.max}
   step={settingSpec.range?.step}
>
   <svelte:fragment slot="right">
      {#if premium && !isPremium()}
         <span title="This setting is Patreon-only">
            <iconify-icon icon="fa6-solid:crown" />
         </span>
      {/if}
   </svelte:fragment>
</ArgInput>
{#if hint}
   <span class="ui-label-text ui-text-xs ui-ml-2">{hint}</span>
{/if}
