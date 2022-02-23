<script>
  import { groups, ascending, descending } from "d3";
  import Icon from "$components/helpers/Icon.svelte";
  export let data;
  export let metric = "norm_blend";
  export let selectedTeam;

  export let visible;

  const groupedTeams = groups(data, (d) => d.team);
  const teams = groupedTeams.map(([abbr, all]) => {
    const withUpgrade = all
      .filter((d) => d.upgrade && d.team === d.draft_team)
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

  // teams.forEach((t) => {
  //   const n = t.players.filter((d) => !d.image);
  //   n.forEach((d) => console.log(d.id, d.name));
  // });
  $: currentTeam = teams.find((d) => d.abbr === selectedTeam.abbr);
  $: if (currentTeam) visible = false;
</script>

<figure>
  <div class="squad">
    <div class="inner">
      <ul>
        {#each currentTeam.players as { id, year, pick, norm_blend, name, upgrade, image, draft_team, team }}
          <li class:visible>
            <div class="downgrade">
              <span class="player">
                <!-- <span class="pick">#{pick}</span> -->
                <!-- <span class="pick">{draft_team !== team ? draft_team : ""}</span> -->
                <span class="headshot">
                  <img src="assets/headshots/{image ? id : 'default'}.png" alt="{name} headshot" />
                </span>
                <span class="name">
                  {name}
                </span>
                <div class="info">
                  <p class="row"><span>Pick</span><span>#{pick}</span></p>
                  <p class="row"><span>Team</span><span>{team}</span></p>
                  <p class="row">
                    <span>Rating</span><span>{Math.round(norm_blend)}</span>
                  </p>
                </div>
              </span>
            </div>
            <div class="swap">
              <span class="year">{year}</span>
              <Icon strokeWidth="3px" name="arrow-right" />
            </div>
            <div class="upgrade">
              <span class="player">
                <!-- <span class="pick">#{upgrade.pick}</span> -->
                <span class="headshot">
                  <img
                    src="assets/headshots/{upgrade.image ? upgrade.id : 'default'}.png"
                    alt="{upgrade.name} headshot"
                  />
                </span>
                <span class="name">
                  {upgrade.name}
                </span>
                <div class="info">
                  <p class="row"><span>Pick</span><span>#{upgrade.pick}</span></p>
                  <p class="row"><span>Team</span><span>{upgrade.team}</span></p>
                  <p class="row">
                    <span>Rating</span><span>{Math.round(upgrade.norm_blend)}</span>
                  </p>
                </div>
              </span>
            </div>
          </li>
        {/each}
        <li class="team">
          <img
            src="assets/logos/{selectedTeam.abbr.toLowerCase()}.svg"
            alt="{selectedTeam.name} logo"
          />
          <p class="place">
            <span class="city">The {selectedTeam.city}</span>
            <span class="mascot"> Could Have Beens</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</figure>

<style>
  figure {
    margin: 2em auto 4em auto;
    min-height: 320px;
    padding: 0 0.5em;
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
    top: calc(var(--border-size) * 1);
    left: calc(var(--border-size) * 1);
    width: 100%;
    height: 100%;
    z-index: -1;
    background: var(--color-fg);
    outline: var(--border-size) solid var(--color-fg);
  }

  .inner {
    position: relative;
    padding: 1em 0;
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
    padding: 0;
    transform: translateX(-0.5em);
  }

  .team span {
    display: block;
  }

  .team .mascot {
    font-weight: var(--bold);
    text-transform: uppercase;
    font-size: 1.125em;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    /* justify-content: center; */
  }

  li {
    display: flex;
    align-items: center;
    padding: 0;
    padding-bottom: 0.25em;
    font-size: 0.9em;
    line-height: 1;
    width: 100%;
    justify-content: space-evenly;
    position: relative;
    user-select: none;
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
    position: relative;
  }

  .info {
    width: 100%;
    display: none;
  }

  .visible .info {
    display: block;
  }

  .info .row {
    display: flex;
    justify-content: space-between;
    background-color: var(--color-gray-100);
    padding: 0.25em;
    margin: 0;
    line-height: 1;
    margin-bottom: 2px;
    font-size: 14px;
  }

  .info .row:nth-of-type(even) {
    background-color: var(--color-gray-200);
  }

  .headshot {
    display: inline-block;
    width: 3.75em;
    height: 3.75em;
    border-radius: 50%;
    border: calc(var(--border-size) * 0.5) solid var(--color-fg);
    overflow: hidden;
  }

  .downgrade .headshot {
    background: var(--color-red-light);
  }

  .upgrade .headshot {
    background: var(--color-green-light);
  }

  .name {
    margin-top: 0.5em;
    height: 2em;
    font-weight: var(--extrabold);
    text-align: center;
  }

  .swap {
    position: absolute;
    top: 1em;
    left: 50%;
    font-size: 1.25em;
    color: var(--color-gray-400);
    align-items: center;
    display: flex;
    flex-direction: column;
    transform: translate(-50%, 0);
  }

  .year {
    display: block;
    margin-bottom: 0.25em;
    font-weight: var(--bold);
    font-size: 0.75em;
  }

  .headshot img {
    width: 100%;
    height: 100%;
    filter: grayscale(100%);
  }

  @media only screen and (min-width: 850px) {
    .inner {
      padding: 2em;
    }

    .headshot {
      width: 5.25em;
      height: 5.25em;
    }

    li {
      padding: 1em;
      font-size: 1em;
      width: 50%;
      justify-content: space-between;
    }

    .team {
      transform: translate(-0.5em, -1.25em);
    }

    .team .mascot {
      font-size: 1.5em;
    }

    .squad:before {
      top: calc(var(--border-size) * 2);
      left: calc(var(--border-size) * 2);
    }

    .swap {
      top: 2em;
    }
  }
</style>
