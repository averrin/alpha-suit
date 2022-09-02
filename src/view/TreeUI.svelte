<svelte:options accessors={true} />

<script>
   // import "virtual:windi.css";
   import { selected, tagsStore, theme } from "../modules/stores.js";
   import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
   import RightPane from "./components/RightPane.svelte";
   import LeftPane from "./components/LeftPane.svelte";
   import { setContext, getContext, tick, onDestroy } from "svelte";
   import TagSettings from "crew-components/TagSettings";
   import Tag from "crew-components/tags";

   import "crew-components/styles/foundry-fixes.scss";
   import "crew-components/styles/alpha-ui.scss";
   import "crew-components/styles/global.scss";
   import "crew-components/styles/themes.scss";
   import "../main.scss";

   export let elementRoot;

   setContext("tagsStore", tagsStore);

   let editTag;
   function tagRClick(e, tag) {
      editTag = $tagsStore.find((t) => t.text == tag);
      if (!editTag) {
         editTag = new Tag(tag);
      }
      logger.info(e, tag, editTag);
   }

   setContext("tagRClick", tagRClick);

   const { application } = getContext("external");
   const position = application.position;
   const { height, width, maxWidth } = position.stores;
   let contentH = $height;
   let contentW = $width;
   onDestroy(height.subscribe((h) => (contentH = h - 30)));
   onDestroy(width.subscribe((w) => (contentW = w)));

   const unsub = selected.subscribe((s) => {
      tick().then(() => {
         if (s.length > 0) {
            width.set(880);
         } else {
            width.set(400);
         }
      });
   });
   onDestroy(unsub);
</script>

<ApplicationShell bind:elementRoot>
   <main class="alpha-ui ui-flex ui-flex-row ui-gap-2 ui-container" data-theme={$theme}>
      <TagSettings {editTag} />
      <div
         class="ui-flex-col ui-flex"
         class:ui-w-[40%]={$selected.length > 0}
         class:ui-w-full={$selected.length == 0}
         style="height: {contentH}px;"
      >
         <LeftPane />
      </div>
      {#if $selected.length > 0}
         <div
            class="ui-bg-base ui-flex-col ui-flex"
            class:ui-w-[60%]={$selected.length > 0}
            style="height: {contentH}px;"
         >
            <RightPane />
         </div>
      {/if}
   </main>
</ApplicationShell>

<style>
</style>
