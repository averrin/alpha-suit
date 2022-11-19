<script>
   import tippy from "sveltejs-tippy";

   export let item;
   export let maximize = false;
   export let draggable = true;

   async function drag(e) {
      let type = "ActiveEffect";
      let data = { type, id: item.id, data: item.data, uuid: item.uuid };
      let sData = { data: JSON.stringify(data) };
      e.dataTransfer.setData("text/plain", sData.data);
   }
   let thumb = item.icon;
   let title = `${item.name}`;

   let tooltip;
   const props = {
      content: () => {
         return tooltip.innerHTML;
      },
      placement: "bottom",
      allowHTML: true,
   };

   function formatDescription(desc) {
      return desc;
   }
</script>

<div bind:this={tooltip} style="display:none">
   <h1 class="ui-flex ui-flex-row ui-items-center ui-gap-2">
      <div
         class="ui-w-full ui-h-full ui-border-none !ui-rounded-md ui-bg-contain ui-bg-no-repeat ui-w-8 ui-h-8"
         style:background-image="url({thumb})"
      />

      {title}
   </h1>
   {#if item?.data?.data?.description?.value}
      {@html formatDescription(item?.data?.data?.description?.value)}
   {/if}
</div>

{#if tooltip}
   <div
      class="zoom-container ui-w-full ui-h-full ui-border-none !ui-rounded-md ui-bg-contain ui-bg-no-repeat"
      class:ui-w-8={!maximize}
      class:ui-h-8={!maximize}
      class:ui-bg-cover={maximize}
      style:background-image="url({thumb})"
      alt=""
      {draggable}
      on:pointerdown={() => null}
      on:click
      on:dragstart={drag}
      style:cursor="grab"
      use:tippy={props}
   />
{/if}
