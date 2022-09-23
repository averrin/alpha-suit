<script>
    import ItemIconSegment from "./ItemIconSegment.svelte"
    export let item;
    let value;
    let color;
    $: {
        value = item.data.data.quantity;
        if (value == 0) {
            color = 'red';
        }
    }

</script>

{#if value}
<span class="ic-segment" title={item.name}>
    <!-- <span class="icon" style="background-image: url({item.img})"></span> -->
	<ItemIconSegment item={item}/>
    <span style={color!="" ? `color: ${color};` : ''}>{value}</span>
</span>
{/if}

<style lang="scss">
    .ic-segment {
        align-items: center;
        display: flex;
    }
</style>
