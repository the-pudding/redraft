<script>
  import { mean, format } from "d3";
  import SvelteTable from "svelte-table";
  import Footer from "$components/Footer.svelte";
  import data from "$data/redraft.csv";

  const stats = ["VORP", "WS", "WA", "RWAR"];
  // id,name,year,pick,team,seasons,games,minutes,VORP,WS,PIPM,WA,VORP_top,WS_top,PIPM_top,WA_top,redraft_VORP,redraft_WS,redraft_PIPM,redraft_WA,redraft_VORP_top,redraft_WS_top,redraft_PIPM_top,redraft_WA_top,redraft_blend,redraft_blend_top
  const clean = data
    .map((d) => ({
      name: d.name,
      year: +d.year,
      team: d.team,
      pick: +d.pick,
      // VORP: +d.VORP,
      // WS: +d.WS,
      // PIPM: +d.PIPM,
      // WA: +d.WA,
      // VORP_top: +d.VORP_top,
      // WS_top: +d.WS_top,
      // PIPM_top: +d.PIPM_top,
      // WA_top: +d.WA_top,
      _VORP: +d.redraft_VORP,
      _WS: +d.redraft_WS,
      _WA: +d.redraft_WA,
      _RWAR: +d.redraft_RWAR,
      _VORP_top: +d.redraft_VORP_top,
      _WS_top: +d.redraft_WS_top,
      _WA_top: +d.redraft_WA_top,
      _RWAR_top: +d.redraft_RWAR
    }))
    .map((d) => ({
      ...d,
      _blend: +format(".2f")(mean(stats.map((v) => d[`_${v}`]))),
      _blend_top: +format(".2f")(mean(stats.map((v) => d[`_${v}_top`])))
    }));

  clean.sort((a, b) => a.pick - b.pick);

  const rows = clean;
  const years = [...new Set(clean.map((d) => d.year))];
  years.sort((a, b) => a - b);
  let selection = { year: years[0] };

  const columns = Object.keys(clean[0]).map((d) => ({
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
