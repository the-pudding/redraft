<script>
  import { groups, ascending } from "d3";
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

  $: data.sort((a, b) => {
    const order = { "+": -1, "-": 1, undefined: 0 };
    return ascending(a.grade[0], b.grade[0]) || ascending(order[a.grade[1]], order[b.grade[1]]);
  });

  $: bins = groups(data, (d) => d.grade);
</script>

<h3>First-Rounders Report Card</h3>
<figure>
  {#each data as { name, grade, year }}
    <div class="player" style="background-color: {colors[grade]};">
      <span>{name}</span>
      <span>{grade}</span>
      <span>{year}</span>
    </div>
  {/each}
</figure>

<!-- <table>
  <thead>
    <th>Name</th>
    <th>Pick Grade</th>
    <th>Year</th>
  </thead>
  {#each data as { name, grade, year }}
    <tr>
      <td>{name}</td>
      <td>{grade}</td>
      <td>{year}</td>
    </tr>
  {/each}
</table> -->

<!-- 
<figure>
  {#each bins as [grade, players]}
    <div class="bin">
      <div class="players">
        <h3>{grade}</h3>
        {#each players as { name, year }}
          <div class="player">
            <p><span>{year}</span>{name}</p>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</figure> -->
<style>
  figure {
    max-width: 40em;
    display: flex;
    flex-wrap: wrap;
  }

  .player {
    width: 50%;
    border: 1px solid var(--color-bg);
    display: flex;
    justify-content: space-between;
    padding: 0.5em 0;
  }

  span {
    width: 100%;
    display: inline-block;
    padding: 0 0.5em;
    line-height: 1;
    white-space: nowrap;
  }

  span:nth-of-type(1) {
    width: 10em;
  }

  span:nth-of-type(2) {
    width: 3em;
    text-align: left;
  }

  span:nth-of-type(3) {
    width: 4em;
    text-align: left;
  }

  table {
    max-width: 30em;
    margin: 0 auto;
  }

  td:last-of-type,
  th:last-of-type {
    text-align: right;
  }
</style>
