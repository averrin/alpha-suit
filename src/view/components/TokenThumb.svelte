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

<img
   class="icon"
   src={thumb}
   style:border={targeted ? `2px solid  ${player.data.color}` : "none"}
   on:click
   on:pointerdown
   on:dblclick
   title={token.name || token.data.name}
   alt={token.name || token.data.name}
/>

<style lang="scss">
   .icon {
      border-radius: 4px;
      width: 30px;
      height: 30px;
   }
</style>
