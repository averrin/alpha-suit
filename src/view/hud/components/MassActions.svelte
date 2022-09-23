<script>
   export let tokens;

   function selectAll(event) {
      if (event.which == 1) {
         tokens.forEach((c) => c.control({ releaseOthers: false }));
      } else if (event.which == 3) {
         tokens.forEach((c) => c.release());
      }
   }

   function targetAll(event) {
      if (event.which == 1) {
         tokens.forEach((c) => c.setTarget(game.user, { releaseOthers: false }));
      } else if (event.which == 3) {
         tokens.forEach((c) => c.setTarget(false, { releaseOthers: true, user: game.user }));
      }
   }

   function toCombat(event) {
      if (event.which == 1) {
         tokens.forEach((c) => !c.document.inCombat && c.toggleCombat());
      } else if (event.which == 3) {
         tokens.forEach((c) => c.document.inCombat && c.toggleCombat());
      }
   }

   function assignXP() {
      globalThis.game.MonksTokenBar.assignXP(tokens);
   }
   function requestRoll() {
      globalThis.game.MonksTokenBar.requestRoll(tokens);
   }

   let hasTB;
   $: hasTB = typeof globalThis.game.MonksTokenBar !== "undefined";
   let hasNap;
   $: hasNap = game.modules.get("nap-time")?.active;

   function requestNap() {
      document.querySelector('[data-canvas-layer="tokens"]').click();
      document.querySelector("[data-tool='nap-time']").click();
   }
</script>

<div class="ui-flex ui-flex-row ui-justify-start ui-mt-2 ui-items-center">
   <button class="icon sq" on:pointerdown|preventDefault|stopPropagation={selectAll} title="Select all | Realise all">
      <i class="fas fa-expand" />
   </button>

   <button class="icon sq" on:pointerdown|preventDefault|stopPropagation={targetAll} title="Target all | Untarget all">
      <i class="fas fa-bullseye" />
   </button>

   <button
      class="itemicon-segment icon sq"
      on:pointerdown|preventDefault|stopPropagation={toCombat}
      title="To combat | From combat"
   >
      <div class="icon" style="background-image: url(icons/svg/combat.svg)" />
   </button>

   {#if hasTB}
      <div class="divider" />

      <button class="icon sq" on:pointerdown|preventDefault|stopPropagation={assignXP} title="Assign XP">
         <i class="fas fa-book-medical" />
      </button>

      <button class="icon sq" on:pointerdown|preventDefault|stopPropagation={requestRoll} title="Assign XP">
         <div class="icon" style="background-image: url(icons/svg/d20.svg)" />
      </button>
   {/if}

   {#if hasNap}
      <div class="divider" />
      <button class="icon sq" on:pointerdown|preventDefault|stopPropagation={requestNap} title="Nap time">
         <i class="fas fa-bed" />
      </button>
   {/if}
</div>
