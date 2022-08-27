<script>
   import { onDestroy } from "svelte";

   import SelectedDocument from "./SelectedDocument.svelte";
   import TokenThumb from "./TokenThumb.svelte";
   import { selected } from "../../modules/stores.js";
   export let item;
   let tokens = [];

   function getTokens(i) {
      return canvas.scene.tokens.contents.filter((t) => t.actor.id == i.id) || [];
   }

   const unsub = Hooks.on("refreshToken", () => (tokens = getTokens($item)));
   onDestroy((_) => Hooks.off("refreshToken", unsub));

   const unsub2 = item.subscribe((i) => {
      if (!i) return;
      tokens = getTokens(i);
   });
   onDestroy(unsub2);

   function tokenClick(token) {
      globalThis.canvas.animatePan({ x: token.object.center.x, y: token.object.center.y, scale: 1 });
   }

   function tokenAltClick(event, token) {
      if (event.which == 3) return token.object.control({ releaseOthers: !event.shiftKey });
      if (event.which == 2) return token.sheet.render(true);
   }
</script>

{#if $item}
   <div class="ui-p-2 ui-flex ui-flex-col ui-gap-2">
      <SelectedDocument bind:item />
      {#if tokens?.length > 0}
         <div class="ui-input-group">
            <span>Tokens</span>
            <div class="ui-border ui-flex ui-flex-row ui-gap-1 ui-p-1 ui-bg-zinc-200">
               {#each tokens as token (token.id)}
                  <TokenThumb
                     {token}
                     on:click={(_) => tokenClick(token)}
                     on:pointerdown={(e) => tokenAltClick(e, token)}
                  />
               {/each}
            </div>
         </div>
      {/if}
   </div>
{/if}
