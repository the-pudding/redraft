<script>
  import { groups, ascending } from "d3";
  import SortTable from "$components/helpers/SortTable.svelte";
  export let data;
  const colors = {
    "A+": "#61e8e1",
    A: "#81eae3",
    "A-": "#9bebe6",
    "B+": "#b3ece8",
    B: "#c8edea",
    "B-": "#dceeed",
    "C+": "#efefef",
    C: "#f4d9d3",
    "C-": "#f7c2b8",
    "D+": "#f8ab9e",
    D: "#f69484",
    "D-": "#f37c6b",
    F: "#ee6352"
  };

  const customSort = (a, b, fn) => {
    const order = { "+": -1, "-": 1, undefined: 0 };
    return (
      fn(a.grade[0], b.grade[0]) ||
      fn(order[a.grade[1]], order[b.grade[1]]) ||
      fn(a.betterCount, b.betterCount)
    );
  };

  data.sort((a, b) => customSort(a, b, ascending));

  let rows = data.map((d) => ({
    ...d,
    style: `background-color: ${colors[d.grade]}`
  }));

  let columns = [
    {
      label: "Name",
      prop: "name",
      type: "text"
    },
    {
      label: "Grade",
      prop: "grade",
      type: "text",
      dir: "asc",
      sortFn: customSort
    },
    {
      label: "Better Players",
      prop: "betterCount",
      type: "number"
    },
    {
      label: "Year",
      prop: "year",
      type: "number"
    }
  ];
</script>

<h3>First Round Picks Report Card</h3>
<SortTable {rows} {columns} />
