<script>
  import { descending } from "d3";
  import SortTable from "$components/helpers/SortTable.svelte";
  export let data;

  data.sort((a, b) => descending(a.norm_blend, b.norm_blend));

  let rows = data.slice(0, 50).map((d, i) => ({
    rank: i + 1,
    name: d.name,
    score: Math.round(d.norm_blend)
  }));

  let columns = [
    {
      label: "Rank",
      prop: "rank",
      sort: false,
      type: "number"
    },
    {
      label: "Name",
      prop: "name",
      sort: false,
      type: "text"
    },
    {
      label: "Normalized Score",
      prop: "score",
      sort: false,
      type: "number"
    }
  ];
</script>

<div id="method-table">
  <h3>Appendix: Top 50 Players Since the 1989 Draft</h3>
  <p>
    A player’s normalized score is a blend of four advanced stats based on their top five seasons,
    then scaled to the 🐐 who is #1 in every stat.
  </p>
  <SortTable {columns} {rows} />
</div>

<style>
  div {
    padding-top: 2em;
  }

  p {
    font-size: 1em;
  }
</style>
