<script>
  import { extent, scaleLinear, mean, group, groups, ascending, descending } from "d3";
  export let data;

  const grouped = groups(data, (d) => d.team);
  const teams = grouped.map(([abbr, players]) => ({
    abbr,
    players,
    avg: mean(players.map((d) => d.mixed_moved))
  }));

  const x = scaleLinear()
    .domain(extent(teams, (d) => d.avg))
    .range([0, 100]);

  teams.sort((a, b) => descending(a.avg, b.avg));
</script>

<h1>Average spots moved for all picks</h1>
<figure>
  {#each teams as { abbr, players, avg }}
    <div class="row">
      <div class="team" style="margin-left: {x(avg)}%">
        <p>{abbr} ({avg.toFixed(1)})</p>
      </div>
    </div>
  {/each}
</figure>

<style>
  figure {
    position: relative;
    width: 90%;
    max-width: 60em;
    margin: 0 auto;
  }

  .row {
    position: relative;
  }

  p {
    margin: 0.25em 0;
    display: inline-block;
    transform: translate(-50%, 0);
    white-space: nowrap;
    background: var(--color-off-black);
    color: var(--color-white);
    font-weight: bold;
    padding: 0 0.25em;
  }

  span {
    display: block;
    width: 1em;
    height: 1em;
    transform: translate(-50%, 0);
    background: gray;
    border-radius: 50%;
  }
</style>
