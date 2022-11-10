<script>
   export let selectedFiles;
   export let isSearch = false;
   import CopyButton from "crew-components/CopyButton";
   import Tags from "crew-components/Tags";
   import { isImage, isVideo, showFile, setting, logger } from "crew-components/helpers";
   import { notify } from "../../modules/notify";
   import { createEventDispatcher } from "svelte";
   import { SETTINGS } from "../../modules/constants";
   import { isPremium } from "crew-components/premium";
   import { writable } from "svelte/store";
   const dispatch = createEventDispatcher();

   let fileTags = writable(setting(SETTINGS.FILES_TAGS));

   // style:width={`${Math.max(100 / selectedFiles.length, 30)}%`}
   // style:height={`${100 / Math.round(selectedFiles.length / 3 + 1)}%`}
   // String base 64 to blob
   function dataURItoBlob(dataURI) {
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);

      for (var i = 0; i < byteString.length; i++) {
         ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ab], { type: mimeString });

      return blob;
   }

   async function copyFile(file) {
      const img = new Image();
      img.onload = async function () {
         const i = await ImageHelper.createThumbnail(file.id, {
            width: img.width,
            height: img.height,
            quality: 1,
         });
         await navigator.clipboard.write([
            new ClipboardItem({
               "image/png": dataURItoBlob(i.thumb),
            }),
         ]);
         notify.info("Image copied!");
      };
      img.src = file.id;
   }

   function setTags(file, e) {
      fileTags.update((tags) => {
         tags[`${file.store}/${file.id}`] = e.detail?.tags;
         setting(SETTINGS.FILES_TAGS, tags);
         return tags;
      });
   }
</script>

<div class="ui-w-full ui-flex ui-flex-row ui-gap-2 selected-container">
   <!-- <div class="ui-flex ui-flex-row ui-gap-1 ui-flex-wrap ui-h-full" style="width: 33%"> -->
   <div class="ui-h-full ui-grid-flow-col ui-gap-1" style="width: 40%">
      {#each selectedFiles as file (file.id)}
         <div
            style:background-image={`url(${file.id})`}
            class="ui-col-auto ui-row-auto ui-rounded-md selected-preview"
            style=""
         >
            {#if isVideo(file.name)}
               <video
                  id={`video--${file.id}`}
                  class="ui-rounded-md"
                  disablePictureInPicture
                  style="width: 100%;"
                  controls
               >
                  <source src={file.id} type="video/webm" />
               </video>
            {/if}
         </div>
      {/each}
   </div>
   <div class="ui-h-full ui-flex ui-flex-col ui-gap-2 ui-w-full">
      {#each selectedFiles as file (file.id)}
         <div class="ui-h-full ui-flex ui-flex-col ui-gap-2 ui-w-full">
            <div class="ui-input-group ui-input-group-md ui-w-full">
               <input type="text" class="ui-input ui-w-full" value={file.id} readonly />
               <CopyButton icon="fa6-solid:copy" text={file.id} title="Copy path" />
               {#if isVideo(file.name)}
                  {#if Sequencer && Sequencer.Database.inverseFlattenedEntries?.get(file.id)}
                     <CopyButton
                        icon="fa6-solid:database"
                        title={"Copy Sequencer path: " + Sequencer.Database.inverseFlattenedEntries.get(file.id)}
                        text={Sequencer.Database.inverseFlattenedEntries.get(file.id)}
                        notification={"Copy Sequencer path: " + Sequencer.Database.inverseFlattenedEntries.get(file.id)}
                     />
                  {/if}
               {/if}
            </div>
            <div class="ui-flex ui-flex-row ui-gap-2">
               {#if isImage(file.id)}
                  <button style="width: unset !important" class="ui-btn ui-btn-md" on:click={(_) => showFile(file)}
                     >Show image</button
                  >
                  <button
                     style="width: unset !important"
                     class="ui-btn ui-btn-md"
                     on:click={(_) => copyFile(file)}
                     disabled={!isPremium()}
                     class:ui-btn-disabled={!isPremium()}
                     class:ui-btn-outline={!isPremium()}
                     title={!isPremium() ? "This feature is Patreon-only" : "Copy image to clipboard"}
                  >
                     {#if !isPremium()}
                        <iconify-icon icon="fa6-solid:crown" class="ui-mr-2" />
                     {/if}
                     Copy image</button
                  >
               {/if}
               {#if isSearch}
                  <button
                     style="width: unset !important"
                     class="ui-btn ui-btn-md"
                     on:click={(_) => dispatch("openFileFolder", file)}>Open folder</button
                  >
               {/if}
            </div>
            <div
               class="ui-input-group ui-input-group-md"
               style="
    border: 1px solid hsl(var(--b3));
    border-radius: 0.5rem;
          "
            >
               <span>Tags</span>
               {#if isPremium()}
                  <Tags tags={$fileTags[`${file.store}/${file.id}`]} on:tags={(e) => setTags(file, e)} />
               {:else}
                  <div class="ui-h-full ui-flex-row ui-items-center ui-p-2 ui-gap-2">
                     <iconify-icon icon="fa6-solid:crown" class="ui-mr-2" />
                     This feature is Patreon-only.
                  </div>
               {/if}
            </div>
         </div>
      {/each}
   </div>
</div>

<style>
   .selected-preview {
      background-size: contain;
      background-repeat: no-repeat;
      height: 100%;
   }
   .ui-grid {
      /* grid-template-rows: minmax(40px, 1fr); */
      /* grid-template-columns: repeat(auto-fill, minmax(1fr, 40px)); */
      /* grid-template-rows: max-content; */
      /* grid-template-columns: auto; */
      /* --n: 4; */
      /* grid-template-columns: repeat(auto-fill, minmax(max(200px, 100% / var(--n)), 1fr)); */
   }
   .selected-container {
      height: 200px;
   }
</style>
