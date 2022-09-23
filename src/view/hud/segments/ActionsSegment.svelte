<script>
    import { foundry } from '../../modules/foundry.js';
    import { moduleId, SETTINGS } from '../../constants.js';
    import { getContext, onDestroy } from 'svelte';
    import { actionsStore }          from '../../modules/stores.js';
    let actions;
    const unsubscribe = actionsStore.subscribe(value => {
	    actions = value;
    });
    onDestroy(unsubscribe);

    const showActions = typeof foundry.tokenActionHUD !== 'undefined' && foundry.settings.get(moduleId, SETTINGS.SHOW_ACTIONS);
    const category = foundry.settings.get(moduleId, SETTINGS.ACTIONS_CATEGORY);
    let buttons = [];
    $: {
        buttons = [];
        if (showActions && actions && actions.categories) {
            const found = actions.categories
                .filter(c => c.name == category);
            if (found.length > 0) {
                const subc = found[0].subcategories
                    .filter(c => c.name != "Toggles");;
                subc.forEach(c => buttons.push(...c.actions));
            }
            buttons = buttons;
        }
    }

    function onClick(e) {
        let target = e.currentTarget;
        let value = target.value;
        foundry.tokenActionHUD.rollHandler.doHandleActionEvent(e, value);
        target.blur();
    }
</script>

{#if showActions}
<span class="actions-segment">
    {#each buttons as action}
        <button class="sq"
            on:click|preventDefault|stopPropagation={onClick}
            on:pointerdown|preventDefault|stopPropagation={()=>null}
            value={action.encodedValue}
            title={action.name}
        >
            <div class="icon" style="background-image: url({action.img && action.img != '' ? action.img : 'icons/svg/d20.svg'});"></div>
        </button>
	{/each}
</span>
{/if}

<style lang="scss">
    .actions-segment {
        margin: 0 4px;
    }
</style>
