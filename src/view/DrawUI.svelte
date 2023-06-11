<svelte:options accessors={true} />

<script>
   import AlphaShell from "crew-components/AlphaShell";
   import IconButton from "crew-components/IconButton";
   import ArgInput from "crew-components/ArgInput";
   import { onDestroy, tick } from "svelte";
   import { tintImage } from "crew-components/helpers";
   import { drawMarkers } from "../modules/stores.js";
   export let elementRoot;

   const lastLayer = canvas.activeLayer;
   canvas.drawings.activate();
   setTimeout((_) => document.querySelector("li[data-tool='freehand'").click(), 100);

   let opts = {
      strokeWidth: 8,
      strokeColor: game.user.color,
      strokeAlpha: 1,
      bezierFactor: 0.5,
      fillType: 0,
      fillColor: "#ffffff",
      fillAlpha: 0.5,
      texture: "",
      text: "",
      fontFamily: "Signika",
      fontSize: 48,
      textColor: "#FFFFFF",
      textAlpha: 1,
   };

   function applyOpts() {
      const defaults = DrawingDocument.cleanData(opts, { partial: true });
      logger.info(defaults);
      game.settings.set("core", DrawingsLayer.DEFAULT_CONFIG_SETTING, defaults);
   }
   applyOpts();

   onDestroy((_) => {
      lastLayer.activate();
   });

   function clear() {
      canvas.scene.deleteEmbeddedDocuments(
         "Drawing",
         canvas.drawings.objects.children.filter((o) => o.document.author == game.user).map((o) => o.id)
      );
   }

   async function createMarker(marker) {
      let mark = {
         strokeWidth: 2,
         strokeColor: game.user.color,
         strokeAlpha: 0.5,
         bezierFactor: 0,
         fillType: 2,
         fillColor: "#ffffff",
         fillAlpha: 1,
         texture: marker.path,
         text: "",
         fontFamily: "Signika",
         fontSize: 48,
         textColor: "#FFFFFF",
         textAlpha: 1,
         shape: {
            type: "r",
            width: 200,
            height: 200,
            radius: null,
            points: [],
         },
         z: 100,
      };

      const img = await tintImage(mark.texture, marker.colored ? opts.strokeColor : "#ffffff");
      if (marker.colored) {
         mark.texture = img.url;
      }
      mark.shape.width = img.width;
      mark.shape.height = img.height;

      const controlled = [canvas.tiles.controlled, ...globalThis.canvas.tokens.controlled].flat();
      let t = await globalThis.warpgate.crosshairs.show({
         drawIcon: true,
         icon: mark.texture,
         label: `Pick position`,
         interval: 0,
      });
      t = { x: t.x - mark.shape.width / 2, y: t.y - mark.shape.height / 2 };
      controlled.forEach((c) => c.control());
      canvas.scene.createEmbeddedDocuments("Drawing", [{ ...mark, ...t }]);
      applyOpts();
   }
</script>

<AlphaShell bind:elementRoot id="draw">
   <div class="ui-flex ui-flex-col ui-items-center ui-gap-0 ">
      <div class="ui-flex ui-flex-row ui-items-center ui-gap-2 ui-p-2 ui-w-full">
         <ArgInput type="color" bind:value={opts.strokeColor} on:change={applyOpts} />
         <ArgInput type="int" bind:value={opts.strokeWidth} on:change={applyOpts} />
         <IconButton title="Clear all" size="md" on:click={clear} icon="icon-park-solid:clear-format" />
      </div>
      <div class="ui-flex ui-flex-row ui-items-center ui-gap-2 ui-p-2 ui-w-full ui-flex-wrap">
         {#each $drawMarkers.filter(m => m.path) as marker (marker.path)}
            <IconButton title="Marker" size="md" on:click={(_) => createMarker(marker)} icon={marker.path} />
         {/each}
      </div>
   </div>
</AlphaShell>
