<script>
  import { group, groups, ascending, descending } from "d3";
  export let data;
  export let metric = "norm_blend";

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
    // const top30 = clean.filter((p) => p.pick < 30 && p.pick > 10);
    top10.sort((a, b) => descending(a.upgrade[metric] - a[metric], b.upgrade[metric] - b[metric]));
    // top30.sort((a, b) => descending(a.upgrade[metric] - a[metric], b.upgrade[metric] - b[metric]));

    const players = top10.slice(0, 5);
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
      <div class="team">
        <h2>{abbr}</h2>
        {#each players as { pick, norm_blend, name, upgrade }}
          <p>
            #{pick} ({norm_blend}) {name} could've been {upgrade.name} #{upgrade.pick} ({upgrade.norm_blend})
          </p>
        {/each}
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
    width: 50em;
    padding: 0 1em;
  }
</style>
