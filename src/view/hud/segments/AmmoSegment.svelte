<script>
    import { findItems } from '../../modules/helpers.js';
    import ItemCountSegment from './ItemCountSegment.svelte'
    import { getContext, onDestroy } from 'svelte';
    let tokenStore = getContext('token');
    let token;
    const unsubscribe = tokenStore.subscribe(value => {
	    token = value;
    });
    onDestroy(unsubscribe);
    let item;
    $: {
        const attacks = token?.document?.actor?.items.filter(i => i.hasAttack);
        const withAmmo = attacks.filter(i => i.data.data?.consume?.target);
        if (withAmmo.length > 0) {
            const id = withAmmo[0].data.data?.consume?.target;
            let ammo = findItems(token, [id]);
            if (ammo.length >= 0) {
                item = ammo[0];
            }
        }
    }

</script>

{#if item}
<div class="divider"></div>
<ItemCountSegment item={item}/>
{/if}
