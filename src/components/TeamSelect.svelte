<script>
  import { ascending } from "d3";
  import teams from "$data/teams.json";

  teams.sort((a, b) => ascending(a.name, b.name));
  export let team = { name: "", abbr: "" };
  let value = "";
  $: match = teams.find((t) => t.abbr === value) || {};
  $: team.name = match.name;
  $: team.abbr = match.abbr;
  $: team.city = match.city;
</script>

<select bind:value>
  <option value="">Choose a team</option>
  {#each teams as { name, abbr }}
    <option value={abbr}>{name}</option>
  {/each}
</select>
