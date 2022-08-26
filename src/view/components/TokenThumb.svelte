<script>
   import { thumbs, updateThumb } from "crew-components/helpers";
   export let token;
   export let player = game.user;

   $: targeted = player.targets.has(token);
   let thumb;
   (async () => {
      await updateThumb(token);
      thumb = thumbs[token.document?.texture?.src || token?.data?.img];
   })();
</script>

<button class="token-icon" class:targeted on:click on:pointerdown title={token.name || token.data.name}>
   <img class="icon" src={thumb} style:border={targeted ? `2px solid  ${player.data.color}` : "none"} />
</button>

<style lang="scss">
   button.token-icon {
      width: 30px;
      height: 30px;
   }
   .icon {
      border-radius: 4px;
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
