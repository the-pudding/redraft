<script>
  import { descending } from "d3";
  export let data;

  data.sort((a, b) => descending(a.norm_blend, b.norm_blend));
  const top = data.slice(0, 50);
</script>

<div id="method-table">
  <h3>Top 50 Players Since the 1989 Draft</h3>
  <table>
    <thead>
      <th valign="bottom">Rank</th>
      <th valign="bottom">Name</th>
      <th valign="bottom">Normalized Production</th>
    </thead>
    {#each top as { name, norm_blend }, i}
      <tr>
        <td>{i + 1}</td>
        <td>{name}</td>
        <td>{Math.round(norm_blend)}</td>
      </tr>
    {/each}
  </table>
</div>

<style>
  div {
    padding-top: 2em;
  }

  table {
    width: 100%;
    margin: 0 auto;
  }

  th {
    vertical-align: bottom;
    line-height: 1.2;
  }

  td:nth-of-type(1),
  th:nth-of-type(1) {
    width: 3.5em;
  }

  td:nth-of-type(1),
  td:nth-of-type(3),
  th:nth-of-type(1),
  th:nth-of-type(3) {
    text-align: right;
  }
</style>
