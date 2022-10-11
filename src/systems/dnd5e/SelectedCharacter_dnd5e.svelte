<script>
   import DataProgressSegment from "../../view/hud/segments/DataProgressSegment.svelte";
</script>

<div class="ui-flex ui-flex-col ui-gap-2 ui-w-full">
   <h2 class="ui-text-center ui-font-bold">Character</h2>
   <div class="ui-flex ui-flex-row ui-gap-2">
      <div class="ui-input-group ui-input-group-md ui-w-auto">
         <span class="ui-font-bold">HP</span>
         <div
            class="ui-px-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300"
         >
            <DataProgressSegment path="attributes.hp" color="hsl(var(--er))" />
         </div>
      </div>

      <!-- <div class="ui-input-group ui-input-group-md ui-w-auto"> -->
      <!--    <span>XP</span> -->
      <!--    <div -->
      <!--       class="ui-px-2 ui-border ui-text-base-content ui-flex ui-flex-row ui-items-center ui-gap-1 ui-p-1 ui-bg-base-300" -->
      <!--    > -->
      <!--       <ProgressValueSegment path="details.xp" label="xp" icon="icons/svg/upgrade.svg" /> -->
      <!--    </div> -->
      <!-- </div> -->
   </div>
</div>
