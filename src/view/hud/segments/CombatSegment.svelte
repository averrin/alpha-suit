<script>
    import ToggleSegment from './ToggleSegment.svelte'
    import { getContext, onDestroy } from 'svelte';
    let tokenStore = getContext('token');
    let token;
    let state;
    const unsubscribe = tokenStore.subscribe(value => {
	    token = value;
	    state = token.document.inCombat;
    });
    onDestroy(unsubscribe);

    async function toggleCombat() {
        if (event.which == 1) {
            token.toggleCombat();
        } else if (event.which == 3) {
            await token.toggleCombat();
            game.user.targets.forEach(async c => !c.document.inCombat && await c.toggleCombat())
        }
    }
</script>

<ToggleSegment
    onClick={toggleCombat}
    iconOn="url(icons/svg/combat.svg)"
    iconOff="url(icons/svg/sword.svg)"
    value={state}
    title={state ? 'In Combat' : "Not in combat"}
/>
