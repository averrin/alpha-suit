<script>
   import { fileIndex, indexInProcess, rebuildIndex, indexPath, indexPercents } from "../../modules/file_index.js";
   import toast_ from "svelte-french-toast";

   export let toast;
   function formatBytes(bytes, decimals = 2) {
      if (!+bytes) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
   }
</script>

<div class="ui-w-full ui-overflow-hidden" style="overflow-wrap: break-word;">
   <div class="ui-flex ui-flex-row ui-gap-2">
      Index size:
      <span class="ui-font-bold">{$fileIndex.length}</span> /
      <span class="ui-font-bold">{formatBytes(new Blob($fileIndex).size)}</span> /
      <span class="ui-font-bold">~{$indexPercents}%</span>
   </div>
   <div>
      {#if $indexPath}
         Index path: <span class="ui-font-bold">{$indexPath}</span>
      {/if}
   </div>
   {#if $indexPercents != 0 && $indexPercents != 100}
      <progress class="ui-progress ui-w-full" value={$indexPercents} max="100" />
   {/if}

   {#if toast}
      <div class="ui-link ui-mt-3 ui-font-bold ui-text-center ui-w-full" on:click={() => toast_.dismiss(toast.id)}>
         Close
      </div>
   {/if}
</div>

<style>
   progress::-webkit-progress-value {
      transition: width 0.8s ease-in-out;
      background-color: hsl(210 64% 31%) !important;
   }
</style>
