<script>
   import FilterBar from "./FilterBar.svelte";
   import { filterAdvanced, system, browserMode } from "../../modules/stores.js";
   import ArgInput from "crew-components/ArgInput";
   import { createSort, createShow, createFilter } from "crew-components/helpers";
   import { CollapsibleCard } from "svelte-collapsible";
   import { onDestroy } from "svelte";
   import { SETTINGS } from "../../modules/constants.js";
   import { logger, setting } from "crew-components/helpers";

   let modeName = $browserMode?.title || "Common";
   let aliases = {};
   if ($system && $system.aliases) {
      aliases = $system.aliases[modeName];
   }

   let cache = {};
   onDestroy(
      browserMode.subscribe((m) => {
         cache = {};
         modeName = m?.title || "Common";
         aliases = $system.aliases[modeName];
      })
   );

   function addFilter(filter, e) {
      logger.info(filter, e.detail);
      let val = e.detail;
      if (!val) return;
      cache[filter.label] = val;
      filterAdvanced.update((f) => {
         f.filters = f.filters || [];
         f.filters = f.filters.filter((f) => f.id != filter.label);
         if (filter.control == "multiselect") {
            val = val.map((v) => filter.options.find((o) => o.label == v));
            let filters = val
               .filter((v) => v)
               .map((v) => {
                  if (filter.template) {
                     return filter.template
                        .replaceAll("${value}", v.value)
                        .replaceAll("${attribute}", filter.attribute);
                  }
                  return `${filter.attribute} == ${v.value}`;
               });
            if (filter.logic == "or" && filters.length > 1) {
               filters = ["(" + filters.join(" or ") + ")"];
               //make "or" filters just "in"
            }
            filters = filters.map((val) => createFilter(aliases, val, filter.label));
            f.filters.push(...filters);
            return f;
         } else if (filter.control == "compare-int") {
            if (val.length != 2 || !val[1]) {
               return f;
            }
            val = `${filter.attribute} ${val[0].value} ${val[1]}`;
         } else if (filter.control == "select" && filter.attribute) {
            val = `${filter.attribute} == ${val}`;
         }
         if (val != "") {
            f.filters.push(createFilter(aliases, val, filter.label));
         }
         return f;
      });
   }

   function addSort(sort, dir = "asc") {
      filterAdvanced.update((f) => {
         if (sort.label) {
            f.sort = f.sort?.filter((s) => s?.id != sort.label) || [];
         }
         f.sort.push(createSort(aliases, sort.query, dir, sort.label));
         if (sort.show) {
            if (f.show?.find((s) => s.field == sort.query)) {
               return f;
            }
            f.show = f.show || [];
            f.show.push(createShow(aliases, sort.query));
         }
         return f;
      });
   }

   function setNameSearch(e) {
      filterAdvanced.update((f) => {
         f.filters = f.filters?.filter((f) => f.id != "name") || [];
         f.filters.push(createFilter(aliases, e.detail, "name"));
         return f;
      });
   }

   function clearSort() {
      filterAdvanced.update((f) => {
         f.sort = [];
         return f;
      });
   }
</script>

<div class="ui-p-2 ui-flex ui-flex-col ui-gap-2 ui-w-full ui-h-full ui-max-w-full ui-overflow-x-auto">
   <div class:ui-hidden={!setting(SETTINGS.ADVANCED_MODE)}>
      <FilterBar filter={filterAdvanced} />
   </div>

   <div class="ui-divider ui-h-1 ui-m-1" />
   <ArgInput type="string" label="Name" on:change={(e) => setNameSearch(e)} />

   {#if $system && $system?.data?.sortings[$browserMode.title]}
      <div class="ui-border ui-border-base-300 ui-bg-base-100 ui-rounded ui-shadow-md ui-p-2">
         <CollapsibleCard open={false}>
            <h2 slot="header">Sortings</h2>
            <div slot="body" class="ui-flex ui-flex-row ui-gap-2 ui-flex-wrap ui-pt-2">
               {#each $system?.data?.sortings[$browserMode.title] as sort}
                  {#if sort.asc}
                     <div
                        class="ui-btn ui-btn-xs"
                        on:click={() => addSort(sort)}
                        class:ui-btn-primary={$filterAdvanced.sort?.find((s) => s.id == sort.label && s.dir == "asc")}
                     >
                        {sort.label} 🠓
                     </div>
                  {/if}
                  {#if sort.desc}
                     <div
                        class="ui-btn ui-btn-xs"
                        on:click={() => addSort(sort, "desc")}
                        class:ui-btn-primary={$filterAdvanced.sort?.find((s) => s.id == sort.label && s.dir == "desc")}
                     >
                        {sort.label} 🠑
                     </div>
                  {/if}
               {/each}
               <div class="ui-btn ui-btn-xs ui-btn-error" on:click={() => clearSort()}>clear</div>
            </div>
         </CollapsibleCard>
      </div>
   {/if}

   {#if $system && $system?.data.filters && $system?.data.filters[$browserMode.title]}
      <div class="ui-flex ui-flex-row ui-gap-2 ui-flex-wrap filters">
         {#each Object.entries($system?.data.filters[$browserMode.title]) as [cat, filters]}
            <div class="ui-border ui-border-base-300 ui-bg-base-100 ui-rounded ui-shadow-md ui-p-2">
               <CollapsibleCard open={false}>
                  <h2 slot="header">{cat}</h2>
                  <div class="ui-flex ui-flex-col ui-gap-2 ui-pt-2" slot="body">
                     {#each filters as filter (filter.label)}
                        <ArgInput
                           value={cache[filter.label]}
                           spec={filter}
                           type={filter.control}
                           label={filter.label}
                           on:change={(e) => addFilter(filter, e)}
                           compact={true}
                        />
                     {/each}
                  </div>
               </CollapsibleCard>
            </div>
         {/each}
      </div>
   {:else}
      <p>
         Your system isn't supported yet. The instruction how to contribute is <a
            class="ui-link"
            target="_blank"
            href="https://github.com/averrin/alpha-suit/wiki/How-to-add-system-support">HERE</a
         >.
      </p>
      <p>
         You can perform filters and sortings by hand using the top search bar. <a
            class="ui-link"
            target="_blank"
            href="https://github.com/averrin/alpha-suit/wiki/How-to-use-filters">HERE</a
         > is the manual.
      </p>
   {/if}
</div>

<style lang="scss">
   .filters {
      --main-input-height: 2rem !important;
   }
</style>
