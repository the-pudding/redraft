<script>
  import { descending } from "d3";
  import copy from "$data/doc.json";
  import SortTable from "$components/helpers/SortTable.svelte";
  export let data;

  data.sort((a, b) => descending(a.norm_blend, b.norm_blend));

  let rows = data.slice(0, 50).map((d, i) => ({
    ...d,
    VORP: Math.round(d.norm_VORP),
    WS: Math.round(d.norm_WS),
    WA: Math.round(d.norm_WA),
    RWAR: Math.round(d.norm_RWAR),
    rank: i + 1,
    name: d.name,
    rating: Math.round(d.norm_blend)
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
      label: "Rating",
      prop: "rating",
      sort: true,
      type: "number",
      dir: "desc"
    },
    {
      label: "VORP",
      prop: "VORP",
      sort: true,
      type: "number"
    },
    {
      label: "WS",
      prop: "WS",
      sort: true,
      type: "number"
    },
    {
      label: "WA",
      prop: "WA",
      sort: true,
      type: "number"
    },
    {
      label: "RWAR",
      prop: "RWAR",
      sort: true,
      type: "number"
    }
  ];
</script>

<div id="method-table">
  <h3>{copy.appendixTitle}</h3>
  <p>
    {copy.appendixDek}
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

  :global(#method-table th) {
    border-bottom: 2px solid var(--color-fg);
  }

  :global(#method-table td:nth-of-type(n + 3), #method-table th:nth-of-type(n + 3)) {
    width: 5em;
  }

  @media only screen and (max-width: 640px) {
    :global(#method-table td:nth-of-type(n + 4), #method-table th:nth-of-type(n + 4)) {
      display: none;
    }
  }
</style>
