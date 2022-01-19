<script>
  import { extent, scaleLinear, max, mean, group, groups, ascending, descending } from "d3";
  import Report from "$components/Report.svelte";
  import { mascot } from "$utils/teamLookup.js";

  export let data;

  let activeTeam = undefined;

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
  <ul>
    {#each teams as { abbr, players, pick, moved, rank_blend, avg, pct_correct }}
      <li class="team" style="--left: {x(pct_correct)}%;">
        <div class="above">
          <button
            on:click={() => {
              activeTeam = activeTeam === abbr ? undefined : abbr;
            }}
          >
            <span class="percent">{Math.round(pct_correct * 100)}%</span>
            <span class="mascot">{mascot(abbr)}</span>
            <img src="assets/logos/{abbr.toLowerCase()}.svg" alt="{abbr} logo" />
          </button>
        </div>
        <div class="below" class:visible={activeTeam === abbr}>
          <Report data={data.filter((d) => d.team === abbr && d.pick <= 30)} />
        </div>
      </li>
    {/each}
  </ul>
</figure>

<style>
  figure {
    position: relative;
    width: 90%;
    max-width: 60em;
    margin: 4em auto;
  }

  .team {
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: var(--left);
  }

  button {
    background: none;
    padding: 0 0.25em 0 0.5em;
    margin: 0;
    line-height: 1;
    display: inline-block;
    white-space: nowrap;
    transform: translate(-100%, 0);
    position: relative;
    font-weight: var(--bold);
  }

  button:hover {
    background: var(--color-green);
  }

  img {
    width: 2em;
    height: 2em;
    display: inline-block;
    vertical-align: middle;
    /* position: absolute;
    top: 0;
    left: 0;
    display: block; */
    /* transform: translate(0%, -0.25em); */
  }

  .percent {
    color: var(--color-gray-500);
    font-size: 12px;
    display: none;
    position: absolute;
  }

  li:first-of-type .percent,
  li:last-of-type .percent {
    display: inline-block;
    top: 0;
    left: 0;
    transform: translate(0, -125%);
    /* background-color: var(--color-gray-100); */
  }

  .below {
    display: none;
    position: relative;
    transform: translate(calc(var(--left) * -1), 0);
    width: 30em;
  }

  .below.visible {
    display: block;
  }
</style>
