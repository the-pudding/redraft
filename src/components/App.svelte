<script>
  import SvelteTable from "svelte-table";
  import Footer from "$components/Footer.svelte";
  import data from "$data/redraft.csv";

  // id,name,year,pick,team,seasons,games,minutes,VORP,WS,PIPM,WA,VORP_top,WS_top,PIPM_top,WA_top,redraft_VORP,redraft_WS,redraft_PIPM,redraft_WA,redraft_VORP_top,redraft_WS_top,redraft_PIPM_top,redraft_WA_top,redraft_blend,redraft_blend_top
  const clean = data.map((d) => ({
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
    redraft_VORP: +d.redraft_VORP,
    redraft_WS: +d.redraft_WS,
    redraft_PIPM: +d.redraft_PIPM,
    redraft_WA: +d.redraft_WA,
    redraft_VORP: +d.redraft_VORP_top,
    redraft_WS: +d.redraft_WS_top,
    redraft_PIPM: +d.redraft_PIPM_top,
    redraft_WA: +d.redraft_WA_top,
    redraft_blend: +d.redraft_blend,
    redraft_blend_top: +d.redraft_blend_top
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

<SvelteTable {columns} {rows} bind:filterSelections={selection} />

<!-- <Footer /> -->
