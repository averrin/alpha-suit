<script>
   import { canvas } from "../../modules/foundry.js";
   import { thumbs, updateThumb } from "../../modules/helpers";
   import { getContext } from "svelte";
   export let token;
   export let player;
   function onIconClick(event) {
      if (targeted) {
         token.setTarget(false, { user: player, releaseOthers: false });
      } else {
         token.setTarget(player, { releaseOthers: !event.shiftKey });
      }
   }
   function iconAltClick(event) {
      if (event.which == 2) return token.control({ releaseOthers: !event.shiftKey });
      if (event.which == 3) return canvas.animatePan({ x: token.center.x, y: token.center.y, scale: 1 });
      return null;
   }

   $: targeted = player.targets.has(token);
   let thumb;
   (async () => {
      await updateThumb(token);
      thumb = thumbs[token.document?.texture?.src || token?.data?.img];
   })();
</script>

<button
   class="token-icon"
   class:targeted
   on:click|preventDefault|stopPropagation={onIconClick}
   on:pointerdown|preventDefault|stopPropagation={iconAltClick}
   title={token.name || token.data.name}
>
   <img class="icon" src={thumb} style:border={targeted ? `2px solid  ${player.data.color}` : "none"} />
</button>

<style lang="scss">
   button.token-icon {
      width: 30px;
      height: 30px;
      margin-right: 6px;
   }

   button {
      // width: 24px;
      height: 30px;
      padding: 2px;
      background: none;
      color: #eee;
      border: none;
      font-size: 24px;
      padding: 0;
      display: inline-flex;
      align-items: center;
   }

   button:hover {
      cursor: pointer;
      border: none;
      box-shadow: none;
      color: #aaf;
   }
</style>
