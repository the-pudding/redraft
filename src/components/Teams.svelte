<script>
  import { extent, scaleLinear, max, mean, group, groups, ascending, descending } from "d3";
  import { mascot } from "$utils/teamLookup.js";

  export let data;

  const averages = groups(data, (d) => d.pick).map(([pick, players]) => ({
    pick,
    avg: mean(players, (d) => d.moved)
  }));

  const grouped = groups(data, (d) => d.team);
  const teams = grouped.map(([abbr, players]) => ({
    abbr,
    players,
    pct_correct: mean(players.map((d) => (!!d.upgrade ? 0 : 1))),
    pick: mean(players.map((d) => d.pick)),
    rank_blend: mean(players.map((d) => d.rank_blend)),
    moved: mean(players.map((d) => d.moved)),
    avg: mean(players.map((d) => d.moved - averages.find((v) => v.pick === d.pick).avg))
  }));

  const x = scaleLinear()
    // .domain(extent(teams, (d) => d.avg))
    .domain([0, 0.5])
    .range([0, 100]);

  teams.sort((a, b) => descending(a.pct_correct, b.pct_correct));
</script>

<figure>
  {#each teams as { abbr, players, pick, moved, rank_blend, avg, pct_correct }}
    <div class="team" style="--left: {x(pct_correct)}%;">
      <img src="assets/logos/{abbr.toLowerCase()}.svg" alt="{abbr} logo" />
      <p>{mascot(abbr)}</p>
    </div>
  {/each}
</figure>

<style>
  figure {
    position: relative;
    width: 90%;
    max-width: 60em;
    margin: 0 auto;
    border: 1px dashed var(--color-gray-light);
  }

  .team {
    position: relative;
    margin-bottom: 0.25em;
    left: var(--left);
  }

  img {
    width: 1.5em;
    height: 1.5em;
    position: absolute;
    top: 50%;
    left: 0;
    display: block;
    transform: translate(-110%, -50%);
  }

  p {
    margin: 0;
    line-height: 1;
    display: block;
    white-space: nowrap;
    /* font-weight: var(--bold); */
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
