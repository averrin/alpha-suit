<script>
   import { isImage, isSound, isVideo, setting } from "crew-components/helpers";
   import CopyButton from "crew-components/CopyButton";
   import { SETTINGS } from "../../modules/constants.js";

   import tippy from "sveltejs-tippy";

   export let file;
   export let mode = "tiles";
   export let selected = false;
   export let useThumbs = false;
   export let imageHeight = 64;
   export let maximize = false;
   export let zoom = true;
   if (zoom) {
     zoom = mode == "tiles" && (isImage(file.id) || isVideo(file.id))
   }

   const isSequencer = game.modules.get("sequencer")?.active;

   function findPoster(file) {
      if (isVideo(file.name)) return "icons/svg/video.svg";
      return "icons/svg/sound.svg";
   }

   function onDragStart(event, file) {
      if (!isImage(file.name) && !isVideo(file.name)) return;
      const dragData = {
         type: "Tile",
         name: file.name,
         id: file.id,
         texture: { src: file.id },
         tileSize: setting(SETTINGS.FILES_DROP_GRID),
         blockDirector: event.ctrlKey && !event.altKey,
         temp: event.ctrlKey,
         instant: event.altKey,
      };
      event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
   }

   import { createEventDispatcher } from "svelte";
   const dispatch = createEventDispatcher();
   function onFileClick(e, file) {
      dispatch("click", { e, file });
   }
</script>

<div
   id={`file--${file.id}`}
   class="ui-rounded-md ui-cursor-pointer ui-bg-base-300 ui-flex ui-flex-row ui-items-center ui-p-2"
   class:zoom-container={zoom}
  style:height={maximize ? `100%` :`${imageHeight}px`}
   style:min-width={maximize ? `100%` : (mode == "big" ? `100%` : `${imageHeight}px`)}
   style:background-image={isImage(file.id)
      ? useThumbs
         ? `url(modules/alpha-suit/assets/question.svg)`
         : `url(${file.id})`
      : "unset"}
   alt={file.name}
   title={file.name}
   style="background-size: contain; background-repeat: no-repeat;"
   on:mouseup={(e) => onFileClick(e, file)}
   draggable="true"
   on:dragstart={(e) => onDragStart(e, file)}
   class:ui-w-full={mode == "list"}
   style:background-position={mode == "list" ? "left" : "center"}
   class:file-video={mode != "list" && (isVideo(file.name) || isSound(file.name))}
   class:selected-file={selected}
   use:tippy={{
      content: () => {
         let content = `<div class="alpha-file-tooltip">${file.name}</div>`;
         return content;
      },
      placement: "bottom",
      allowHTML: true,
   }}
>
   {#if isVideo(file.name) || isSound(file.name)}
      <video
         id={`video--${file.id}`}
         class="ui-rounded-md"
         class:file-video={mode == "list"}
         poster={findPoster(file)}
         preload="none"
         disablePictureInPicture
         style="height: 100%;"
         style:width={mode != "list" ? "100%" : "unset"}
         loop
         on:mouseover={(e) => {
            e.target.play();
         }}
         on:mouseout={(e) => {
            e.target.pause();
            e.target.currentTime = 0;
         }}
      >
         <source src={file.id} type="video/webm" />
      </video>
      <!-- <iconify-icon class="seq-icon" icon="fa6-solid:database" title="Sequencer" /> -->
      {#if isSequencer && Sequencer.Database.inverseFlattenedEntries?.get(file.id)}
         <CopyButton
            size="xs"
            icon="fa6-solid:database"
            title={"Copy Sequencer path: " + Sequencer.Database.inverseFlattenedEntries.get(file.id)}
            text={Sequencer.Database.inverseFlattenedEntries.get(file.id)}
            notification={"Copy Sequencer path: " + Sequencer.Database.inverseFlattenedEntries.get(file.id)}
         />
      {/if}
   {/if}

   {#if (!isImage(file.name) && !isVideo(file.name) && !isSound(file.name)) || mode == "list"}
      <div class="ui-text-base-content ui-w-full" style:text-align={mode == "list" ? `center` : "left"}>
         {file.name}
      </div>
   {/if}
</div>

<style>
   .file-video {
      border: solid 1px cadetblue;
   }
   .zoom-container {
      transition: 0.4s ease;
   }
   .zoom-container:hover {
      transform: scale(2);
   }

   .selected-file {
      border: solid 3px indianred;
      transform: scale(1.2);
   }

   :global(.alpha-file-tooltip) {
      font-size: 1.2rem;
   }
</style>
