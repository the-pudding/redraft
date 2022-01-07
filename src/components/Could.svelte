<script>
  import { group, groups, ascending, descending } from "d3";
  export let data;
  export let metric = "mixed";

  const drafts = group(data, (d) => d.year);
  Array.from(drafts).forEach(([year]) => {
    const players = drafts.get(year);
    players.sort((a, b) => ascending(a[metric], b[metric]));
  });

  const getUpgrade = (p) => {
    const players = drafts.get(p.year);
    const match = players.find((u) => u.pick > p.pick && u[metric] < p[metric]);
    return match;
  };

  const upgrades = data.map((d) => ({
    ...d,
    upgrade: getUpgrade(d)
  }));

  const groupedTeams = groups(upgrades, (d) => d.team);
  const teams = groupedTeams.map(([abbr, all]) => {
    const clean = all.filter((p) => p.upgrade);
    // .map((p) => ({
    //   ...p,
    //   upgrade_delta: p[`#_${metric}`] - p.upgrade[`#_${metric}`]
    // }));

    // clean.sort((a, b) => ascending(a.upgrade[`#_${metric}`], b.upgrade[`#_${metric}`]));
    // clean.sort((a, b) => descending(a[`#_${metric}`] - a.pick, b[`#_${metric}`] - b.pick));
    clean.sort((a, b) => ascending(a.pick, b.pick));

    const players = clean.slice(0, 10);
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
        {#each players as { pick, name, upgrade, upgrade_delta }}
          <p>#{pick} {name} could've been {upgrade.name}</p>
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
    width: 33em;
    padding: 0 1em;
  }
</style>
