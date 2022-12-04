<svelte:options accessors={true} />

<script>
   import GridComponent from "./components/GridComponent.svelte";
   export let elementRoot;

   import { getContext, onDestroy, tick } from "svelte";
   const { application } = getContext("external");
   const position = application.position;
   const { width, height, top, left } = position.stores;

   setTimeout(_ => {
     const sb = document.getElementById("sidebar");
     height.set(sb.clientHeight - 60);
     width.set(sb.clientWidth);
   }, 1000)

</script>
<GridComponent {elementRoot} id="sidebar"/>

