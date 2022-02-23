<script>
  import { ascending } from "d3";
  import teams from "$data/teams.json";

  teams.sort((a, b) => ascending(a.mascot, b.mascot));
  export let team = {};
  export let fan;

  let value;

  $: value = fan;

  $: match = teams.find((t) => t.abbr === value) || {};
  $: team.name = match.name;
  $: team.abbr = match.abbr;
  $: team.city = match.city;
</script>

<select aria-label="team" bind:value>
  <option value="" />
  {#each teams as { abbr, mascot }}
    <option value={abbr}>{mascot}</option>
  {/each}
</select>

<style>
  select {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0.25em;
    font-family: var(--sans);
    font-weight: var(--extrabold);
  }
</style>
