<svelte:options accessors={true} />

<script>
   import AlphaShell from "crew-components/AlphaShell";
   import { selected, tagsStore } from "../modules/stores.js";
   import RightPane from "./components/RightPane.svelte";
   import LeftPane from "./components/LeftPane.svelte";
   import { setContext, getContext, tick, onDestroy } from "svelte";
   import TagSettings from "crew-components/TagSettings";
   import Tag from "crew-components/tags";
   import ArgInput from "crew-components/ArgInput";
   import { setting } from "crew-components/helpers";
   import { SETTINGS } from "../modules/constants.js";

   export let elementRoot;

   setContext("tagsStore", tagsStore);

   let editTag;
   function tagRClick(e, tag) {
      editTag = $tagsStore.find((t) => t.text == tag);
      if (!editTag) {
         editTag = new Tag(tag);
      }
   }

   setContext("tagRClick", tagRClick);

   const { application } = getContext("external");
   const position = application.position;
   const { height, width } = position.stores;
   let contentH = $height;
   onDestroy(
      height.subscribe((h) => {
         tick().then(() => {
            const tabs = document.getElementById("tree-tab-container");
            if (tabs) {
               contentH = h - tabs.clientHeight - 4;
            }
         });
      })
   );

   const unsub = selected.subscribe((s) => {
      tick().then(() => {
         if (s.length > 0) {
            width.set(setting(SETTINGS.WINDOW_WIDTH_EXPANDED));
         } else {
            width.set(setting(SETTINGS.WINDOW_WIDTH_COLLAPSED));
         }
      });
   });
   onDestroy(unsub);
</script>

<AlphaShell id="tree" bind:elementRoot>
   <TagSettings {editTag}>
      <ArgInput bind:value={editTag.fav} label="Favorite" type="bool" slot="controls" />
   </TagSettings>

   <div class="ui-flex ui-flex-row ui-gap-2">
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
   </div>
</AlphaShell>
