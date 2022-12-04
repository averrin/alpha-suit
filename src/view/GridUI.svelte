<svelte:options accessors={true} />
<script>
   import AlphaShell from "crew-components/AlphaShell";
   import GridComponent from "./components/GridComponent.svelte";
   export let elementRoot;
</script>

<AlphaShell bind:elementRoot id="grid" trackSize={true}>
  <GridComponent {elementRoot} id="standalone"/>
</AlphaShell>
