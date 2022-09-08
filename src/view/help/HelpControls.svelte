<script>
   import { SETTINGS } from "../../modules/constants";
   import { setting } from "crew-components/helpers";

   let inverted = setting(SETTINGS.INVERT_CLICKS);
</script>

<h1>Alpha Tree controls</h1>
<ul class="ui-text-base-content">
   <li>
      Hold <kbd class="ui-kbd">shift</kbd> and drag to reorder items.
   </li>
   <li>Drop item preview on the canvas to add a token.</li>
   <li>
      <kbd class="ui-kbd">{inverted ? "right" : "left"}-click</kbd> to select an item.
   </li>
   <li>
      <kbd class="ui-kbd">{!inverted ? "right" : "left"}-click</kbd> to open sheet. (With <kbd class="ui-kbd">ctrl</kbd>
      for folders)
   </li>
   <li>
      <kbd class="ui-kbd">ctrl</kbd> + <kbd class="ui-kbd">{inverted ? "right" : "left"}-click</kbd> to add an item to the
      selection.
   </li>
</ul>
