<script>
  import SvelteTable from "svelte-table";
  import Footer from "$components/Footer.svelte";
  import data from "$data/clean.js";

  const rows = data;

  const years = [...new Set(rows.map((d) => d.year))];
  years.sort((a, b) => a - b);

  let selection = { year: years[0] };

  const columns = [
    "name",
    "year",
    "pick",
    "VORP_top",
    "WS_top",
    "WA_top",
    "RWAR_top",
    "#_VORP_top",
    "#_WS_top",
    "#_WA_top",
    "#_RWAR_top",
    "#_mixed"
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
  <li><strong>mix</strong>: mean rank of all four stats draft orders</li>
  <li><strong>top</strong>: using top 5 seasons instead of all</li>
</ul>

<SvelteTable {columns} {rows} bind:filterSelections={selection} />

<!-- <Footer /> -->
