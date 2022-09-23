<script>
    import { getContext, onDestroy } from 'svelte';
    let tokenStore = getContext('token');
    let token;
    let needConvert;
    let imgPath = "icons/svg/chest.svg";  
    const unsubscribe = tokenStore.subscribe(value => {
	    token = value;
        needConvert = globalThis.ItemPiles && token.document.data.img != imgPath;
    });
    onDestroy(unsubscribe);

    const actor = token.document.actor;

///////////////////////////////////////////////////////
//////////////////// CREATED BY ///////////////////////
///////////////////////////////////////////////////////
// This macro was created by u/shuggaloaf.
// If you redistribute this, please just give me credit. 
// Better yet, give them the GitHub link so they're 
// always up to date: 
// https://github.com/Shuggaloaf/NPC-to-Coin-Pile
//
// Enjoy! 
///////////////////////////////////////////////////////

    async function rollCoins(PP, GP, SP, CP) {    
        let currency = actor.data.data.currency;
    
        let rollCP = await new Roll(CP).roll({async:true});
        let rollSP = await new Roll(SP).roll({async:true});
        let rollGP = await new Roll(GP).roll({async:true});
        let rollPP = await new Roll(PP).roll({async:true});
    
        let actorCP = currency.cp + rollCP.total;
        let actorSP = currency.sp + rollSP.total;
        let actorGP = currency.gp + rollGP.total;
        let actorPP = currency.pp + rollPP.total;
        
        await actor.update({"data.currency.cp": currency.cp + rollCP.total, "data.currency.sp": currency.sp + rollSP.total, "data.currency.gp": currency.gp + rollGP.total, "data.currency.pp": currency.pp + rollPP.total});
    }

    async function onClick() {
        
        const rand = new Roll("1d100").evaluate({async: false});

        ///////// Coins /////////

        if(rand.total<26){
        } else if (rand.total>26 && rand.total<56){
            await rollCoins("0","0","0","1d10");              //6CP avg
        } else if (rand.total>55 && rand.total<80){
            await rollCoins("0","0","4d3","1d14+11");         //1GP avg
        } else if (rand.total>79 && rand.total<90){
            await rollCoins("0","2d3","2d10+10","1d21+39");   //5GP avg
        } else if (rand.total>89 && rand.total<95){
            await rollCoins("0","1d6+4","7d5","1d21+59");     //10GP avg
        } else if (rand.total>94 && rand.total<98){
            await rollCoins("0","1d10+5","15d6","50d3");      //20GP avg
        } else if (rand.total>97 && rand.total<100){
            await rollCoins("1d3","10d3+3","15d6","40d4");    //50GP avg
        } else {
            await rollCoins("3d3","24d2","10d6","25d6");      //100GP avg
        }
        
        globalThis.ItemPiles.API.turnTokensIntoItemPiles(token);
	    token.actor.update({
    		"data.attributes.hp.max": 0,
	    });
        await token.document.update({img : imgPath, rotation : 0, vision: false});
    }
</script>

{#if needConvert}
    <button class="itemicon-segment"
        on:click|preventDefault|stopPropagation={onClick}
        on:pointerdown|preventDefault|stopPropagation={()=>null}
        title="To loot pile"
    >
        <div class="icon" style="background: url({imgPath}) no-repeat; background-size: contain;"></div>
    </button>
{/if}

<style lang="scss">
    .icon {
        width: 100%;
        height: 100%;
        border-radius: 4px;
    }
    button {
        width: 30px;
        height: 30px;
        background: none;
        border: none;
        font-size: 20px;
        padding: 0;
    }
</style>
