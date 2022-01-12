<script>
  import { descending } from "d3";
  export let data;

  data.sort((a, b) => descending(a.norm_blend, b.norm_blend));
  const top = data.slice(0, 50);
</script>

<h2>Data and Methods</h2>
<h3>Top 50 Players Since the 1989 Draft</h3>
<p>
  Normalized Production is an average of the top five seasons based on four advanced stats
  (a,b,c,d). Five seasons because average NBA career is 4.5, it gets their best years. Four stats
  because I can never just pick one, they all have their strengths and weaknesses.
</p>
<table>
  <thead>
    <th>Rank</th>
    <th>Name</th>
    <th>Normalized Production</th>
  </thead>
  {#each top as { name, norm_blend }, i}
    <tr>
      <td>{i + 1}</td>
      <td>{name}</td>
      <td>{Math.round(norm_blend)}</td>
    </tr>
  {/each}
</table>

<style>
  table {
    max-width: 28em;
    margin: 0 auto;
  }

  td:nth-of-type(1),
  th:nth-of-type(1) {
    width: 3em;
  }

  td:nth-of-type(1),
  td:nth-of-type(3),
  th:nth-of-type(1),
  th:nth-of-type(3) {
    text-align: right;
  }
</style>
