<script>
   import { foundry } from "../../modules/foundry.js";
   import { moduleId, SETTINGS } from "../../constants.js";
   import TokenIcon from "./TokenIcon.svelte";

   import { getContext, onDestroy } from "svelte";
   let tokenStore = getContext("token");
   let token;
   const unsubscribe = tokenStore.subscribe((value) => {
      token = value;
   });
   onDestroy(unsubscribe);

   function onClick() {
      token.document.actor.sheet.render(true);
   }
   function altClick(event) {
      // if (event.which == 3) return globalThis.canvas.animatePan(({ x: token.center.x, y: token.center.y, scale: 1}));
      if (event.which == 3) return token.document.sheet.render(true);
      return null;
   }
   const showIcons = foundry.settings.get(moduleId, SETTINGS.SHOW_TARGETS);
   const showWarn = foundry.settings.get(moduleId, SETTINGS.SHOW_NAME_NOTIFICATION);

   let owner;
   const users = game.users.filter((u) => u.character == token.document.actor);
   if (users.length > 0) {
      owner = users[0];
   }
</script>

<span class="name-segment">
   {#if showIcons}
      <TokenIcon bind:token player={foundry.user} />
   {/if}
   <button on:click|preventDefault|stopPropagation={onClick} on:pointerdown|preventDefault|stopPropagation={altClick}>
      <div class="marker" style:background={owner ? owner.data.color : "gray"} />
      {token?.name || token?.data?.name}
      {#if (token?.name || token?.data?.name) != token?.document?.actor?.name && showWarn}
         &nbsp;<i class="fas fa-exclamation-triangle" />
      {/if}
   </button>
</span>

<style lang="scss">
   .marker {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-flex;
      margin-right: 4px;
   }
   .name-segment {
      flex-direction: row;
      display: flex;
      justify-content: space-between;
      align-items: center;
   }
</style>
