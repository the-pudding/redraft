<script>
  import { extent, scaleThreshold, max, mean, group, groups, ascending, descending } from "d3";
  import { mascot } from "$utils/teamLookup.js";

  export let data;

  const averages = groups(data, (d) => d.pick).map(([pick, players]) => ({
    pick,
    avg: mean(players, (d) => d.moved)
  }));

  const grouped = groups(data, (d) => d.team);
  const teams = grouped
    .map(([abbr, players]) => ({
      abbr,
      players,
      pct_correct: mean(players.map((d) => (!!d.upgrade ? 0 : 1))),
      pick: mean(players.map((d) => d.pick)),
      rank_blend: mean(players.map((d) => d.rank_blend)),
      moved: mean(players.map((d) => d.moved)),
      avg: mean(players.map((d) => d.moved - averages.find((v) => v.pick === d.pick).avg))
    }))
    .map((d) => ({
      ...d,
      odds: Math.ceil(1 / d.pct_correct - 1 + 1)
    }));

  const byOdds = groups(teams, (d) => d.odds);

  byOdds.sort((a, b) => ascending(a[0], b[0]));

  // teams.sort((a, b) => descending(a.pct_correct, b.pct_correct));
</script>

<figure>
  {#each byOdds as [odds, teamsO]}
    <div class="group">
      <h3 class="odds">1 in {odds}</h3>
      <div class="teams">
        {#each teamsO as { abbr, players, pick, moved, rank_blend, avg, pct_correct, odds }}
          <div class="team" style="--left: {0};">
            <img src="assets/logos/{abbr.toLowerCase()}.svg" alt="{abbr} logo" />
            <p>{mascot(abbr)}</p>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</figure>

<style>
  figure {
    width: 90%;
    max-width: 60em;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
  }

  .group {
    width: calc(1 / 11 * 100%);
    width: 100%;
    outline: 2px solid white;
    position: relative;
    /* width: 100%; */
    /* display: flex; */
  }

  .team {
    position: relative;
    text-align: center;
    margin-bottom: 1em;
  }

  .teams {
    display: flex;
  }

  .odds {
    /* text-align: center; */
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-100%, 0);
    padding-right: 1em;
  }

  img {
    width: 4em;
    height: 4em;
    background: var(--color-bg);
    outline: calc(var(--border-size) * 0.5) solid var(--color-fg);
    padding: 0.25em;
    /* position: absolute;
    top: 50%;
    left: 0; */
    display: inline-block;
    /* border-radius: 50%; */
    /* transform: translate(-110%, -50%); */
  }

  p {
    margin: 0;
    line-height: 1;
    display: none;
    white-space: nowrap;
    font-size: 1.5em;
    font-weight: var(--bold);
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
