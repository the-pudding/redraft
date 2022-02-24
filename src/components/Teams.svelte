<script>
  import { tick } from "svelte";
  import { extent, scaleLinear, max, mean, group, groups, ascending, descending, format } from "d3";
  import Report from "$components/Report.svelte";
  import Icon from "$components/helpers/Icon.svelte";
  import { mascot } from "$utils/teamLookup.js";

  export let data;

  const first = data.filter((d) => d.pick <= 30);

  const grouped = groups(first, (d) => d.team);
  const teams = grouped.map(([abbr, players]) => ({
    abbr,
    players,
    pct_correct: mean(players.map((d) => (!!d.upgrade ? 0 : 1))),
    avg_pick: Math.round(mean(players.map((d) => d.pick)))
  }));

  const x = scaleLinear()
    .domain([0, max(teams, (d) => d.pct_correct)])
    .range([0, 100]);

  teams.sort((a, b) => descending(a.pct_correct, b.pct_correct)) || ascending(a.abbr, b.abbr);

  let activeTeam;

  const onClick = async (abbr) => {
    activeTeam = activeTeam === abbr ? undefined : abbr;
    await tick();
    const el = document.querySelector(`li.team--${abbr}`);
    const { top } = el.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + top - 40);
  };
</script>

<figure>
  <ul>
    {#each teams as { abbr, players, pct_correct }, i}
      <li
        class="team team--{abbr}"
        style="--pct: {x(pct_correct)}%;"
        class:visible={activeTeam === abbr}
      >
        <div class="above">
          <button on:click={() => onClick(abbr)}>
            <img src="assets/logos/{abbr.toLowerCase()}.svg" alt="{abbr} logo" />
            <span class="mascot"
              >{mascot(abbr)}
              {#if i === 0}<em>tap to see pick grades</em>{/if}</span
            >
            {#if i === 0}
              <span class="percent-first"
                >pick the best player {format(".1%")(pct_correct)} of the time</span
              >
            {/if}
            <span class="percent">{format(".1%")(pct_correct).replace("%", "")}</span>
          </button>
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
    padding: 0;
    padding-right: 2.5em;
    width: 100%;
    max-width: 60em;
    margin: 4em auto;
  }

  .team {
    list-style: none;
    border-bottom: 0.25em solid var(--color-bg);
    line-height: 1;
  }

  .team:nth-of-type(even) .above {
    background-color: var(--color-gray-100);
  }

  .team:nth-of-type(odd) .above {
    background-color: var(--color-gray-200);
  }

  .above {
    width: var(--pct);
    /* outline: 0.25em solid var(--color-fg); */
    /* border-bottom: 4px solid var(--color-fg); */
    position: relative;
  }

  button {
    /* background: var(--color-bg); */
    background: none;
    padding: 0 0.5em;
    margin: 0;
    line-height: 1;
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    min-width: 10em;
    text-align: left;
    position: relative;
    font-weight: var(--bold);
  }

  .team:hover .percent {
    color: var(--color-fg);
    transform: translate(100%, -50%) scale(1.25);
  }

  .team:hover .percent-first {
    color: var(--color-fg);
    transform: translate(100%, -50%);
  }

  button:hover {
    background: var(--color-gray-300);
  }

  img {
    width: 2em;
    height: 2em;
    display: inline-block;
    vertical-align: middle;
  }

  .percent,
  .percent-first {
    color: var(--color-gray-600);
    font-size: 14px;
    display: none;
    position: absolute;
    display: inline-block;
    top: 50%;
    right: -1em;
    transform: translate(100%, -50%);
    transform-origin: 50% 50%;
    font-weight: var(--bold);
  }

  .percent-first {
    display: none;
  }

  .team .percent-first {
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

  em {
    display: none;
    margin-left: 0.5em;
    color: var(--color-gray-700);
    font-weight: normal;
    font-size: 12px;
    transform: translateY(-1px);
  }

  .visible em {
    display: none;
  }

  @media only screen and (min-width: 1024px) {
    figure {
      width: 60%;
      padding: 0;
      padding-right: 4em;
    }
    .percent-first {
      display: inline-block;
    }

    .team:first-of-type .percent {
      display: none;
    }
  }
</style>
