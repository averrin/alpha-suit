<script>
    export let item;
    function onClick() {
        item.roll();
    }
    const isReaction = item.data.data?.activation?.type == 'reaction';
</script>

<button class="itemicon-segment icon sq"
    on:click|preventDefault|stopPropagation={onClick}
    on:pointerdown|preventDefault|stopPropagation={()=>null}
    title={item.data.name}
>
    <div class="icon" class:reaction={isReaction} style="background-image: url({item.data.img})"></div>
</button>

<style lang="scss">
    .reaction {
        box-shadow: 0 0 8px #0095ff;
    }
</style>
