<script>
   import { thumbs, updateThumb, tintImage } from "crew-components/helpers";
   export let token;
   export let player = game.user;

   $: targeted = player.targets.has(token);
   let thumb;
   (async () => {
      await updateThumb(token);
      const img = token.document?.texture?.src || token?.data?.img;
      thumb = thumbs[img];

      if (token.data.tint) {
         const tint = await tintImage(thumb, token.data.tint);
         thumb = tint.url;
      }
      if (!thumb) {
         thumb = img;
      }
   })();
</script>

<img
   class="ui-h-8 ui-w-8 !ui-rounded-md"
   src={thumb}
   style:border={targeted ? `2px solid  ${player.data.color}` : "none"}
   on:click
   on:pointerdown
   on:dblclick
   title={token.name || token.data.name}
   alt={token.name || token.data.name}
/>
