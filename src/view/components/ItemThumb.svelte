<script>
   import tippy from "sveltejs-tippy";

   export let item;

   async function drag(e) {
      let type = "Item";
      let data = { type, id: item.id, data: item.data, uuid: item.uuid };
      let sData = { data: JSON.stringify(data) };
      e.dataTransfer.setData("text/plain", sData.data);
   }
   let thumb = item?.img || item.data.icon;
   let highlight;
   if (item.system?.equipped) {
      highlight = "1px solid #88cc88";
   } else if (item.type != "spell" && item.system?.actionType) {
      highlight = "2px solid #6666ee";
   }
   let title = `${item.data.label || item.name}`;
   if (item.data?.data?.quantity > 1) {
      title += ` [${item.data?.data?.quantity}]`;
   }

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
         style:border={highlight}
      />

      {title}
   </h1>
   {#if item?.data?.data?.description?.value}
      {@html formatDescription(item?.data?.data?.description?.value)}
   {/if}
</div>

{#if tooltip}
   <div
      class="ui-w-full ui-h-full ui-border-none !ui-rounded-md ui-bg-contain ui-bg-no-repeat ui-w-8 ui-h-8"
      style:background-image="url({thumb})"
      style:border={highlight}
      alt=""
      draggable={true}
      on:pointerdown={() => null}
      on:click
      on:dragstart={drag}
      style:cursor="grab"
      use:tippy={props}
   />
{/if}
