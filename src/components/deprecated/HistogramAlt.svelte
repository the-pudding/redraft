<script>
  import { scaleDiverging, extent, group, groups, ascending, descending } from "d3";
  export let data;

  const metric = "moved";

  const drafts = groups(data, (d) => d.year);

  drafts.sort((a, b) => ascending(a[0], b[0]));

  const e = extent(data.map((d) => d.moved));
  const scale = scaleDiverging().domain([e[0], 0, e[1]]).range([0, 50, 100]);
</script>

<section>
  <h1>Busts and Steals kind of</h1>
  <div class="drafts">
    {#each drafts as [year, players]}
      <div class="draft">
        <h2>{year}</h2>
        {#each players as { name, pick, moved }}
          <div
            class:over={moved > 5}
            class:under={moved < -5}
            class:over2={moved > 10}
            class:under2={moved < -10}
            class:over3={moved > 20}
            class:under3={moved < -20}
            class="player"
          >
            <!-- style="margin-left: {scale(moved)}%;" -->
            <!-- <span></span> -->
            <p style="top: {scale(moved)}%;">#{pick} {name}</p>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</section>

<style>
  section {
    padding: 1em;
  }

  .draft {
    margin-bottom: 4em;
    padding: 6em;
    position: relative;
    height: 90vh;
    display: flex;
    flex-direction: reverse;
  }

  .draft::before {
    content: "";
    display: block;
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    border-top: 1px dashed lightgray;
  }

  .player {
    margin: 0;
    line-height: 1;
    position: relative;
    width: 10em;
    background: white;
  }

  .player.over p {
    background: lightgreen;
  }

  .player.over2 p {
    background: green;
    color: white;
  }

  .player.over3 p {
    background: darkgreen;
    color: white;
  }

  .player.under p {
    background: pink;
  }

  .player.under2 p {
    background: red;
  }

  .player.under3 p {
    background: darkred;
    color: white;
  }

  p {
    position: absolute;
    /* top: 50%; */
    left: 0;
    /* display: inline-block; */
    font-size: 12px;
    font-weight: bold;
    margin: 0;
    white-space: nowrap;
    text-align: center;
    transform: translate(-50%, 0);
    line-height: 1;
    padding: 0.25em 0.125em;
  }
</style>
