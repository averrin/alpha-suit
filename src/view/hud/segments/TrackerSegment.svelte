<script>
    import {hasTrackers} from "../../modules/helpers.js";
   import ProgressSegment from "../segments/ProgressSegment.svelte"
    import { getContext, onDestroy } from 'svelte';
    let tokenStore = getContext('token');
    let token;
    const unsubscribe = tokenStore.subscribe(value => {
	    token = value;
    });
    onDestroy(unsubscribe);

    export let label = "";
    export let color = "";
    export let trackerName;

    let tracker = null;
    $: {
        if (hasTrackers()) {
            let trackers = globalThis.CrashTNT.getActivitiesForActor(token.document.actor.data.name);
            if (trackers) {
                trackers = trackers.filter(t => t.name == trackerName);
                if (trackers.length > 0) {
                    tracker = trackers[0];
                }
            }
        }
    }

    function increase(){
        tracker.progress++;
        globalThis.CrashTNT.updateActivityProgress(token.document.actor.data.name, trackerName, tracker.progress);
        Hooks.call("updateActor", token.document.actor, {});
    }
    function decrease(){
        tracker.progress--;
        globalThis.CrashTNT.updateActivityProgress(token.document.actor.data.name, trackerName, tracker.progress);
        Hooks.call("updateActor", token.document.actor, {});
    }
</script>


{#if tracker}
<div class="tracker-segment" title={trackerName}>
    {#if label != ""}
        {label}:&nbsp; 
    {/if}
    <button
        on:click|preventDefault|stopPropagation={decrease}
        on:pointerdown|preventDefault|stopPropagation={()=>null}
        >
        <div class="icon" style="background: url(icons/svg/down.svg) no-repeat; background-size: contain;"></div>
    </button>
    <ProgressSegment
	    value={tracker.progress}
	    max={tracker.completionAt}
	    color={color}
    />
    <button
        on:click|preventDefault|stopPropagation={increase}
        on:pointerdown|preventDefault|stopPropagation={()=>null}
        >
        <div class="icon" style="background: url(icons/svg/up.svg) no-repeat; background-size: contain;"></div>
    </button>
</div>
{/if}

<style lang="scss">

    .tracker-segment {
        display: flex;
        align-items: center;
        flex-direction: row;
    }

    button {
        width: 24px;
        height: 24px;
    }
</style>
