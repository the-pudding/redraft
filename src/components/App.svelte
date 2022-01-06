<script>
  import { groups, mean, descending } from "d3";
  import SvelteTable from "svelte-table";
  import Footer from "$components/Footer.svelte";
  import data from "$data/redrafted.csv";

  const NO_VAL = -99;
  const MINS = 1000;
  const stats = ["VORP", "WS", "WA", "RWAR"];

  // id,name,year,pick,team,seasons,games,minutes,VORP,WS,PIPM,WA,VORP_top,WS_top,PIPM_top,WA_top,redraft_VORP,redraft_WS,redraft_PIPM,redraft_WA,redraft_VORP_top,redraft_WS_top,redraft_PIPM_top,redraft_WA_top,redraft_blend,redraft_blend_top

  const clean = data.map((d) => ({
    name: d.name,
    minutes: +d.minutes,
    year: +d.year,
    team: d.team,
    pick: +d.pick,
    VORP: +d.minutes >= MINS ? +d.VORP : NO_VAL,
    WS: +d.minutes >= MINS ? +d.WS : NO_VAL,
    WA: +d.minutes >= MINS ? +d.WA : NO_VAL,
    RWAR: +d.minutes >= MINS ? +d.RWAR : NO_VAL,
    VORP_top: +d.minutes >= MINS ? +d.VORP_top : NO_VAL,
    WS_top: +d.minutes >= MINS ? +d.WS_top : NO_VAL,
    WA_top: +d.minutes >= MINS ? +d.WA_top : NO_VAL,
    RWAR_top: +d.minutes >= MINS ? +d.RWAR_top : NO_VAL
  }));

  stats.forEach((stat) => {
    const seasons = groups(clean, (d) => d.year);
    seasons.forEach(([year, players]) => {
      players.sort((a, b) => descending(a[`${stat}`], b[`${stat}`]));
      players.forEach((p, i) => {
        p[`#_${stat}`] = i + 1;
      });

      players.sort((a, b) => descending(a[`${stat}_top`], b[`${stat}_top`]));
      players.forEach((p, i) => {
        p[`#_${stat}_top`] = i + 1;
      });
    });
  });

  const rows = clean.map((d) => ({
    ...d,
    blend: +mean(stats.map((v) => d[`#_${v}`])).toFixed(2),
    blend_top: +mean(stats.map((v) => d[`#_${v}_top`])).toFixed(2)
  }));

  rows.sort((a, b) => a.pick - b.pick);

  const years = [...new Set(rows.map((d) => d.year))];
  years.sort((a, b) => a - b);
  let selection = { year: years[0] };

  const columns = [
    "name",
    "year",
    "pick",
    "#_VORP_top",
    "#_WS_top",
    "#_WA_top",
    "#_RWAR_top",
    "blend_top"
  ].map((d) => ({
    key: d,
    title: d,
    value: (v) => v[d],
    sortable: true,
    filterOptions: d === "year" ? years : null
  }));
</script>

<ul>
  <li><strong>VORP</strong>: Value Over Replacement Player</li>
  <li><strong>WS</strong>: Win Shares</li>
  <li><strong>WA</strong>: Wins Added</li>
  <li><strong>RWAR</strong>: RAPTOR Wins Above Replacement</li>
  <li><strong>blend</strong>: mean rank of all four stats draft orders</li>
  <li><strong>top</strong>: using top 5 seasons instead of all</li>
</ul>

<SvelteTable {columns} {rows} bind:filterSelections={selection} />

<!-- <Footer /> -->
