<script>
  import { ascending } from "d3";
  import teams from "$data/teams.json";

  teams.sort((a, b) => ascending(a.mascot, b.mascot));
  export let team = {};
  export let fan;
  let value = fan;

  $: match = teams.find((t) => t.abbr === value) || {};
  $: team.name = match.name;
  $: team.abbr = match.abbr;
  $: team.city = match.city;
</script>

<select bind:value>
  <option value="" />
  {#each teams as { abbr, mascot }}
    <option value={abbr}>{mascot}</option>
  {/each}
</select>

<style>
  select {
    padding: 0 0.5em;
  }
</style>
