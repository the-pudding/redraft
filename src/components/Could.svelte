<script>
  import { getContext } from "svelte";
  import { group, groups, ascending, descending } from "d3";
  import Icon from "$components/helpers/Icon.svelte";
  export let data;
  export let metric = "norm_blend";

  const { teamData } = getContext("App");

  const drafts = group(data, (d) => d.year);
  Array.from(drafts).forEach(([year]) => {
    const players = drafts.get(year);
    players.sort((a, b) => ascending(a[metric], b[metric]));
  });

  const getUpgrade = (p) => {
    const players = drafts.get(p.year);
    players.sort((a, b) => descending(a[metric], b[metric]));
    const match = players.find(
      (other) =>
        !upgraded[`${other.id}${p.team}`] &&
        other.team !== p.team &&
        other.pick > p.pick &&
        other[metric] > p[metric]
    );

    return match;
  };

  const upgraded = {};

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

  $: team = teams.find((d) => d.abbr === $teamData.abbr);
</script>

<section>
  <div class="squad">
    <div class="inner">
      <ul>
        {#each team.players as { id, year, pick, norm_blend, name, upgrade, image }}
          <li>
            <div class="downgrade">
              <span class="player">
                <span class="headshot">
                  {#if image}<img src="assets/headshots/{id}.png" alt="" />{/if}
                </span>
                <span class="name">
                  <!-- #{pick} -->
                  {name}
                </span>
              </span>
            </div>
            <div class="swap">
              <span class="year">{year}</span>
              <Icon name="refresh-cw" />
            </div>
            <div class="upgrade">
              <span class="player">
                <span class="headshot">
                  {#if upgrade.image}<img src="assets/headshots/{upgrade.id}.png" alt="" />{/if}
                </span>
                <span class="name">
                  <!-- #{upgrade.pick} -->
                  {upgrade.name}
                </span>
              </span>
            </div>
          </li>
        {/each}
        <li class="team">
          <img src="assets/logos/{$teamData.abbr.toLowerCase()}.svg" alt="{$teamData.name} logo" />
          <p class="place">
            <span class="city">The {$teamData.city}</span>
            <span class="mascot"> Could Have Beens</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</section>

<style>
  .squad {
    max-width: 65em;
    margin: 0 auto;
    background: var(--color-white);
    outline: var(--border-size) solid var(--color-off-black);
    box-shadow: 8px 8px 0px 0px red;
    position: relative;
  }

  .squad:before {
    content: "";
    display: block;
    position: absolute;
    top: calc(var(--border-size) * 2);
    left: calc(var(--border-size) * 2);
    width: 100%;
    height: 100%;
    background: var(--color-gray-dark);
    z-index: -1;
    outline: var(--border-size) solid var(--color-off-black);
  }

  .inner {
    position: relative;
    padding: 2em;
  }

  .squad img {
    display: inline-block;
    width: 5rem;
    height: 5rem;
  }

  .team {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25em;
  }

  .team span {
    display: block;
  }

  .team .mascot {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 1.5em;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    /* justify-content: center; */
  }

  li {
    display: flex;
    align-items: center;
    font-size: 1em;
    padding: 1em;
    line-height: 1;
    width: 50%;
  }

  li span {
    line-height: 1;
  }

  .player {
    display: flex;
    flex-direction: column;
    padding: 0 0.5em;
    width: 14em;
    align-items: center;
  }

  .headshot {
    display: inline-block;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    outline: calc(var(--border-size) * 0.5) solid black;
  }

  .downgrade .headshot {
    background: pink;
  }

  .upgrade .headshot {
    background: lightgreen;
  }

  .name {
    margin-top: 1em;
    font-weight: bold;
  }

  .swap {
    font-size: 1.5em;
    opacity: 0.5;
    align-items: center;
    display: flex;
    flex-direction: column;
    transform: translate(0, -25%);
  }

  .year {
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
    font-size: 0.75em;
  }

  .headshot img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
</style>
