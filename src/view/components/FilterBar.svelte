<script>
   import Tags from "crew-components/Tags";
   import { onDestroy } from "svelte";
   import { createSort, createShow, createFilter, fieldRegex } from "crew-components/helpers";
   import { system, browserMode } from "../../modules/stores.js";

   export let filter;
   let modeName = $browserMode?.title || "Common";
   let aliases = {};
   if ($system && $system.aliases) {
      aliases = $system.aliases[modeName];
   }

   onDestroy(
      browserMode.subscribe((m) => {
         modeName = m?.title || "Common";
         aliases = $system.aliases[modeName];
      })
   );

   function clearFilter() {
      filter.update((f) => {
         f.tags = [];
         f.sort = [];
         f.show = [];
         f.filters = [];
         return f;
      });
   }

   let tags = [];

   function compileTags(filter) {
      let tags =
         filter.tags?.filter((t) => !t.startsWith("sort:") && !t.startsWith("show:") && !t.match(fieldRegex)) || [];
      tags.push(...(filter.sort?.map((s) => `sort:${s.field}${s.dir == "desc" ? "!" : ""}`) || []));
      tags.push(...(filter.show?.map((s) => `show:${s.field}`) || []));
      tags.push(...(filter.filters?.map((s) => s.field) || []));
      return tags;
   }

   function extractSort(tags) {
      let sort = tags.filter((t) => t.startsWith("sort:"));
      sort = sort.map((t) => {
         let field = t.slice(5);
         let dir = "asc";
         if (field.endsWith("!")) {
            field = field.slice(0, -1);
            dir = "desc";
         }
         return createSort(aliases, field, dir);
      });
      return sort;
   }

   function extractShow(tags) {
      let sort = tags.filter((t) => t.startsWith("show:"));
      sort = sort.map((t) => {
         let field = t.slice(5);
         return createShow(aliases, field);
      });
      return sort;
   }

   function extractFilters(tags) {
      tags = tags.filter((t) => !t.startsWith("sort:") && !t.startsWith("show:"));
      let sort = tags.filter((t) => t.match(fieldRegex));
      sort = sort.map((t) => {
         return createFilter(aliases, t);
      });
      return sort;
   }

   function changeTags(e) {
      tags = e.detail.tags;
      filter.update((f) => {
         let rest = tags.filter((t) => !t.startsWith("sort:") && !t.startsWith("show:") && !t.match(fieldRegex));
         f.sort = extractSort(tags);
         f.show = extractShow(tags);
         f.filters = extractFilters(tags);
         f.filters.push(...rest.map((t) => createFilter(aliases, t)));
         f.tags = [];
         console.log(f);
         return f;
      });
   }

   onDestroy(
      filter.subscribe((f) => {
         tags = compileTags(f);
      })
   );
</script>

<div class="ui-input-group">
   <Tags bind:tags on:tags={changeTags} allowPaste={true} allowDrop={true} onlyUnique={true} />
   <button class="ui-btn ui-btn-square ui-h-8 ui-min-h-8 ui-ml-0" on:click={clearFilter}>
      <iconify-icon icon="gridicons:cross" />
   </button>
</div>
