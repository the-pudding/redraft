<script>
  import { extent, scaleLinear, max, mean, group, groups, ascending, descending } from "d3";
  import Report from "$components/Report.svelte";
  import { mascot } from "$utils/teamLookup.js";

  export let data;

  const first = data.filter((d) => d.pick <= 30);

  let activeTeam = undefined;

  const grouped = groups(first, (d) => d.team);
  const teams = grouped.map(([abbr, players]) => ({
    abbr,
    players,
    pct_correct: mean(players.map((d) => (!!d.upgrade ? 0 : 1)))
  }));

  const x = scaleLinear()
    .domain([0, max(teams, (d) => d.pct_correct)])
    .range([0, 100]);

  teams.sort((a, b) => descending(a.pct_correct, b.pct_correct));
</script>

<figure>
  <ul>
    {#each teams as { abbr, players, pct_correct }, i}
      <li class="team" style="--pct: {x(pct_correct)}%;" class:visible={activeTeam === abbr}>
        <div class="above">
          <button
            on:click={() => {
              activeTeam = activeTeam === abbr ? undefined : abbr;
            }}
          >
            <img src="assets/logos/{abbr.toLowerCase()}.svg" alt="{abbr} logo" />
            <span class="mascot">{mascot(abbr)}</span>
          </button>
          {#if i === 0}
            <span class="percent"
              >pick the best player <strong>{Math.round(pct_correct * 100)}%</strong> of the time</span
            >
          {:else}
            <span class="percent">{Math.round(pct_correct * 100)}%</span>
          {/if}
        </div>
        <div class="below">
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
    padding: 0 0.25em;
    max-width: 60em;
    margin: 4em auto;
  }

  .team {
    list-style: none;
    margin: 0.25em;
    line-height: 1;
  }

  .above {
    width: var(--pct);
    outline: 0.25em solid var(--color-fg);
    position: relative;
    min-width: 10em;
  }

  button {
    background: none;
    padding: 0 0.5em;
    margin: 0;
    line-height: 1;
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    text-align: left;
    /* transform: translate(-10em, 0); */
    position: relative;
    font-weight: var(--bold);
  }

  button:hover {
    background: var(--color-gray-100);
  }

  img {
    width: 2em;
    height: 2em;
    display: inline-block;
    vertical-align: middle;
  }

  .percent {
    color: var(--color-gray-500);
    font-size: 12px;
    display: none;
    position: absolute;
    display: inline-block;
    top: 50%;
    right: -1em;
    transform: translate(100%, -50%);
    font-weight: var(--bold);
  }

  .percent strong {
    font-weight: var(--bold);
    color: var(--color-fg);
  }

  li:first-of-type .percent {
    transform: translate(100%, -50%);
    width: 10em;
    text-align: left;
  }

  .below {
    display: none;
    position: relative;
    transform: translate(calc(var(--left) * -1), 0);
    max-width: 30em;
    width: 100%;
    text-align: left;
    margin: 2em 0;
  }

  .visible .below {
    display: block;
  }

  .visible button {
    background: var(--color-fg);
    color: var(--color-bg);
  }
</style>
