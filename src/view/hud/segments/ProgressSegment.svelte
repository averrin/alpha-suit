<script>
   export let value;
   export let max;
   export let color;
</script>

<div class="progress-segment" title="{Math.round((value / max) * 100)}%">
   <div class="progress-bar" style="background-color: {color}; width: {(value / max) * 100}%; border-radius: 0.25rem" />
   <div class="value ui-text-base-content">{value}/{max}</div>
</div>

<style lang="scss">
   .progress-segment {
      min-width: 100px;
      height: 24px;
      display: inline-block;
      border-radius: 0.25rem;
      margin: 0 6px;
      background-color: #eeeeee55;
      align-items: center;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      position: relative;
   }
   .progress-bar {
      height: 24px;
      position: absolute;
      left: 0;
   }
   .value {
      position: absolute;
   }
</style>
