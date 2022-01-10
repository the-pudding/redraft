<script>
  import { group, groups, ascending, descending } from "d3";
  export let data;

  const metric = "moved";

  const getBin = (d) => {
    if (d <= -20) return -20;
    if (d <= -10) return -10;
    // if (d <= -5) return -5;
    if (d >= 20) return 20;
    if (d >= 10) return 10;
    // if (d >= 5) return 5;
    return 0;
  };

  const binned = data
    .filter((d) => d.minutes >= 0)
    .map((d) => ({
      ...d,
      bin: getBin(d[metric])
    }));

  const drafts = groups(
    binned,
    (d) => d.year,
    (d) => d.bin
  );

  drafts.sort((a, b) => ascending(a[0], b[0]));
  drafts.forEach(([year, bins]) => {
    bins.sort((a, b) => ascending(a[0], b[0]));
    // hack TODO
    if (bins.length < 5) bins.unshift([-20, []]);
  });
</script>

<section>
  <h1>Busts and Steals kind of</h1>
  <p>Showing players with minutes > 1000 or that moved 10+ spots in redraft</p>
  <div class="drafts">
    {#each drafts as [year, bins]}
      <div class="draft">
        <h2>{year}</h2>
        <div class="bins">
          {#each bins as [bin, players]}
            <div class="bin">
              {#each players as { name, pick }}
                <p>{name}</p>
              {/each}
            </div>
          {/each}
        </div>
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
  }
  .bins {
    display: flex;
    align-items: flex-end;
  }

  .bin {
    width: 11em;
    margin: 0 0.5em;
    position: relative;
  }

  .bin:before {
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    /* text-align: center; */
    transform: translate(0, 125%);
    padding: 0.5em;
    font-size: 14px;
    border-top: 1px solid currentColor;
  }

  p {
    margin: 0;
    /* text-align: center; */
    /* background: pink; */
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 1px;
    text-overflow: ellipsis;
  }

  .bin:nth-of-type(1) {
    color: #a44;
  }

  .bin:nth-of-type(2) {
    color: #922;
  }

  /* .bin:nth-of-type(3) {
    color: #700;
  } */

  .bin:nth-of-type(3) {
    color: #555;
  }

  /* .bin:nth-of-type(5) {
    color: #070;
  } */

  .bin:nth-of-type(4) {
    color: #292;
  }

  .bin:nth-of-type(5) {
    color: #4a4;
  }

  .bin:nth-of-type(1):before {
    content: "⬇️ 20+ spots";
  }

  .bin:nth-of-type(2):before {
    content: "⬇️ 10+ spots";
  }

  /* .bin:nth-of-type(3):before {
    content: "⬇️ 5+ spots";
  } */

  .bin:nth-of-type(3):before {
    content: "+/- 10 spots";
  }

  /* .bin:nth-of-type(5):before {
    content: "⬆️ 5+ spots";
  } */

  .bin:nth-of-type(4):before {
    content: "⬆️ 10+ spots";
  }

  .bin:nth-of-type(5):before {
    content: "⬆️ 20+ spots";
  }

  .bin:nth-of-type(1),
  .bin:nth-of-type(5) {
    font-size: 20px;
  }

  .bin:nth-of-type(2),
  .bin:nth-of-type(4) {
    font-size: 15px;
  }
  /* 
  .bin:nth-of-type(3),
  .bin:nth-of-type(3) {
    font-size: 12px;
  } */

  .bin:nth-of-type(3) {
    font-size: 10px;
  }
</style>
