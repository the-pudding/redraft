<script>
  import { groups, ascending } from "d3";
  export let data;

  $: data.sort((a, b) => {
    const order = { "+": -1, "-": 1, undefined: 0 };
    return ascending(a.grade[0], b.grade[0]) || ascending(order[a.grade[1]], order[b.grade[1]]);
  });

  $: bins = groups(data, (d) => d.grade);
</script>

<h3>First-Rounders Report Card</h3>
<figure>
  {#each data as { name, grade, year }}
    <div class="player">
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
    display: table-row;
  }

  span {
    display: table-cell;
    width: 100%;
    padding: 0.5em;
  }

  /* h3 {
    font-weight: var(--extrabold);
    font-size: 1.5em;
  } */
  /* 
  .players {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
  }

  .player {
    padding: 0 1em;
    text-align: center;
    font-weight: var(--bold);
  }

  span {
    display: block;
    color: var(--color-gray-500);
    font-weight: normal;
  } */

  table {
    max-width: 30em;
    margin: 0 auto;
  }

  td:last-of-type,
  th:last-of-type {
    text-align: right;
  }
</style>
