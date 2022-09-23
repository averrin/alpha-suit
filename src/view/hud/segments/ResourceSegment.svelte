<script>
    import { getContext, onDestroy } from 'svelte';
    let tokenStore = getContext('token');
    let token;
    const unsubscribe = tokenStore.subscribe(value => {
	    token = value;
    });
    onDestroy(unsubscribe);

    export let iconIndex;
    let bgColor = 'none';
    let border = 'none';
    let hasIcon = false;
    const flags = token.document.data.flags;
    let value = 0;
    let icon;
    let data;
    $: {
        if ("resource-icons" in flags) {
            hasIcon = flags["resource-icons"][`icon${iconIndex}`].resource != '';
            if (hasIcon) {
                data = flags["resource-icons"][`icon${iconIndex}`];
                value = getProperty(token?.document?.actor.getRollData(), data.resource);
                icon = data.img;
                if (data.options.background.active) {
                    bgColor = data.options.background.color;
                }
                if (data.options.tint.active && icon == "") {
                    bgColor = data.options.tint.color;
                }
                if (data.options.border.active) {
                    border = `1px solid ${data.options.border.color}`;
                }
            }
        }
    }

</script>

{#if hasIcon}
    <div
        class="icon resource-icon"
        style="background: url({icon}) no-repeat; background-size: contain; background-color: {bgColor}; border: {border};"
        title="{data.resource}: {value.value}/{value.max}"
    >
        {value.value}
    </div>
{/if}

<style lang="scss">
    .resource-icon {
        width: 30px;
        height: 30px;
        font-size: 20px;
        text-align: center;
        align-items: center;
        justify-content: center;

        text-shadow: -1px -1px 8px rgb(22 22 22), -1px -1px 8px rgb(22 22 22), -1px -1px 8px rgb(22 22 22), -1px -1px 8px rgb(22 22 22);
    }
</style>
