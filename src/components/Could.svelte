<script>
  import { getContext } from "svelte";
  import { groups, ascending, descending } from "d3";
  import Icon from "$components/helpers/Icon.svelte";
  export let data;
  export let metric = "norm_blend";

  const { teamData } = getContext("App");

  const groupedTeams = groups(data, (d) => d.team);
  const teams = groupedTeams.map(([abbr, all]) => {
    const withUpgrade = all
      .filter((d) => d.upgrade)
      .map((d) => ({
        ...d,
        upgrade: data.find((v) => v.id === d.upgrade)
      }));
    const top10 = withUpgrade.filter((d) => d.pick < 11);
    const top20 = withUpgrade.filter((d) => d.pick > 10 && d.pick < 21);
    const top30 = withUpgrade.filter((d) => d.pick > 20 && d.pick < 31);

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

<figure>
  <div class="squad">
    <div class="inner">
      <ul>
        {#each team.players as { id, year, pick, norm_blend, name, upgrade, image }}
          <li>
            <div class="downgrade">
              <span class="player">
                <span class="headshot">
                  <img src="assets/headshots/{image ? id : 'default'}.png" alt="{name} headshot" />
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
                  <img
                    src="assets/headshots/{upgrade.image ? upgrade.id : 'default'}.png"
                    alt="{upgrade.name} headshot"
                  />
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
</figure>

<style>
  figure {
    margin: 4em auto;
  }

  .squad {
    max-width: 50em;
    margin: 0 auto;
    background: var(--color-bg);
    outline: var(--border-size) solid var(--color-fg);
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
    z-index: -1;
    background: var(--color-fg);
    outline: var(--border-size) solid var(--color-fg);
  }

  .inner {
    position: relative;
    padding: 2em;
    background: var(--color-bg);
    color: var(--color-fg);
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
    font-size: 1em;
  }

  .team span {
    display: block;
  }

  .team .mascot {
    font-weight: var(--bold);
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
    width: 9em;
    align-items: center;
  }

  .headshot {
    display: inline-block;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    outline: calc(var(--border-size) * 0.5) solid var(--color-fg);
  }

  .downgrade .headshot {
    background: pink;
  }

  .upgrade .headshot {
    background: lightgreen;
  }

  .name {
    margin-top: 0.5em;
    height: 2em;
    font-weight: var(--extrabold);
    text-align: center;
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
    font-weight: var(--bold);
    font-size: 0.75em;
  }

  .headshot img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    filter: grayscale(100%);
  }
</style>
