<script>
  import { extent, scaleLinear, mean, group, groups, ascending, descending } from "d3";
  export let data;

  const averages = groups(data, (d) => d.pick).map(([pick, players]) => ({
    pick,
    avg: mean(players, (d) => d.moved)
  }));

  const grouped = groups(data, (d) => d.team);
  const teams = grouped.map(([abbr, players]) => ({
    abbr,
    players,
    pick: mean(players.map((d) => d.pick)),
    rank_blend: mean(players.map((d) => d.rank_blend)),
    moved: mean(players.map((d) => d.moved)),
    avg: mean(players.map((d) => d.moved - averages.find((v) => v.pick === d.pick).avg))
  }));

  const x = scaleLinear()
    .domain(extent(teams, (d) => d.avg))
    .range([0, 100]);

  teams.sort((a, b) => descending(a.avg, b.avg));
</script>

<h1>Average spots moved compared to each pick average</h1>
<figure>
  {#each teams as { abbr, players, pick, moved, rank_blend, avg }}
    <div class="team" style="margin-left: {x(avg)}%;">
      <p>{abbr} ({avg.toFixed(1)})</p>
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

  .team {
  }

  p {
    margin: 2px 0;
    display: inline-block;
    transform: translate(-50%, -50%);
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
