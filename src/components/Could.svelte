<script>
  import { getContext } from "svelte";
  import { group, groups, ascending, descending } from "d3";
  export let data;
  export let metric = "norm_blend";

  const { teamName, teamAbbr } = getContext("Team");

  const drafts = group(data, (d) => d.year);
  Array.from(drafts).forEach(([year]) => {
    const players = drafts.get(year);
    players.sort((a, b) => ascending(a[metric], b[metric]));
  });

  const getUpgrade = (p) => {
    const players = drafts.get(p.year);
    players.sort((a, b) => descending(a[metric], b[metric]));
    const match = players.find((other) => other.pick > p.pick && other[metric] > p[metric]);
    return match;
  };

  const upgrades = data.map((d) => ({
    ...d,
    upgrade: getUpgrade(d)
  }));

  const groupedTeams = groups(upgrades, (d) => d.team);
  const teams = groupedTeams.map(([abbr, all]) => {
    const clean = all.filter((p) => p.upgrade);
    const top10 = clean.filter((p) => p.pick < 11);
    const top20 = clean.filter((p) => p.pick > 10 && p.pick < 21);
    const top30 = clean.filter((p) => p.pick > 20 && p.pick < 31);
    top10.sort((a, b) => descending(a.upgrade[metric] - a[metric], b.upgrade[metric] - b[metric]));
    top20.sort((a, b) => descending(a.upgrade[metric] - a[metric], b.upgrade[metric] - b[metric]));
    top30.sort((a, b) => descending(a.upgrade[metric] - a[metric], b.upgrade[metric] - b[metric]));

    const players = [...top10, ...top20, ...top30].slice(0, 5);
    return {
      abbr,
      players
    };
  });

  teams.sort((a, b) => ascending(a.abbr, b.abbr));
</script>

<section>
  <h1>The All <strong>Could've Been</strong> Squads</h1>
  <div class="teams">
    {#each teams as { abbr, players }}
      <div class="team" class:visible={$teamAbbr === abbr}>
        <p class="team-name">
          {abbr} <img src="assets/logos/{abbr.toLowerCase()}.svg" alt="{abbr} logo" />
        </p>
        <ul>
          {#each players as { id, year, pick, norm_blend, name, upgrade, image }}
            <li>
              In {year},
              <span class="player">
                <span class="headshot">
                  {#if image}<img src="assets/headshots/{id}.png" alt="" />{/if}
                </span>
                <span class="name">
                  #{pick}
                  {name}
                </span>
              </span>
              <em>could've been</em>
              <span class="player">
                <span class="headshot">
                  {#if upgrade.image}<img src="assets/headshots/{upgrade.id}.png" alt="" />{/if}
                </span>
                <span class="name">
                  #{upgrade.pick}
                  {upgrade.name}
                </span>
              </span>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</section>

<style>
  .teams {
    display: flex;
    flex-wrap: wrap;
  }

  .team {
    width: 100%;
    padding: 0 1em;
    display: none;
  }

  .team.visible {
    display: block;
  }

  li {
    display: flex;
    align-items: flex-end;
    margin-bottom: 2em;
    /* justify-content: center; */
    font-size: 1vw;
    line-height: 1;
  }

  li span {
    line-height: 1;
  }

  .player {
    display: flex;
    flex-direction: column;
    padding: 0 0.5em;
    /* width: 15em; */
    align-items: center;
  }

  .name {
  }

  .headshot {
    display: inline-block;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    border: 1px solid black;
    background: pink;
    margin-bottom: 1em;
  }

  .player:nth-of-type(2) .headshot {
    background: lightgreen;
  }

  p.team-name img {
    display: inline-block;
    width: 4em;
    height: 4em;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
</style>
