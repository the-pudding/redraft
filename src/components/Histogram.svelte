<script>
  import { group, groups, ascending, descending } from "d3";
  import Range from "$components/helpers/Range.svelte";
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

  const min = drafts[0][0];
  const max = drafts[drafts.length - 1][0];
  let activeYear = max;
</script>

<div class="ui">
  <div class="range">
    <Range label="year" {min} {max} showTicks={true} step={1} bind:value={activeYear} />
  </div>
</div>

<figure>
  <div class="drafts">
    {#each drafts as [year, bins]}
      <div class="draft" class:visible={year === activeYear}>
        <h3>{year} Draft Class</h3>
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
</figure>

<style>
  .ui {
    margin-top: 4em;
  }

  .range {
    width: 90%;
    max-width: 40rem;
    margin: 2em auto;
  }

  h3 {
    text-align: center;
    margin: 0;
  }

  .drafts {
    margin: 0em auto;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 720px;
  }

  .draft {
    display: none;
  }

  .visible {
    display: block;
  }

  .bins {
    display: flex;
    flex-direction: column;
  }

  .bin {
    margin-bottom: 1em;
    position: relative;
    display: flex;
    flex-wrap: wrap;
  }

  .bin:before {
    display: block;
    width: 100%;
    margin: 0;
    font-size: 14px;
    /* text-align: center; */
    font-weight: var(--bold);
  }

  p {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    margin: 2px;
    padding: 0.25rem;
    font-weight: var(--bold);
    text-overflow: ellipsis;
    border: 0.2em solid black;
    /* width: 10em; */
    text-align: center;
    user-select: none;
  }

  .bin:nth-of-type(1) p {
    background: var(--color-red);
  }

  .bin:nth-of-type(2) p {
    background: var(--color-red-light);
  }

  .bin:nth-of-type(3) p {
    background: var(--color-gray-100);
  }

  .bin:nth-of-type(4) p {
    background: var(--color-green-light);
  }

  .bin:nth-of-type(5) p {
    background: var(--color-green);
  }

  .bin:nth-of-type(1):before {
    content: "▼ 20 spots";
  }

  .bin:nth-of-type(2):before {
    content: "▼ 10 spots";
  }

  .bin:nth-of-type(3):before {
    content: "+/- 10 spots";
  }

  .bin:nth-of-type(4):before {
    content: "▲ 10 spots";
  }

  .bin:nth-of-type(5):before {
    content: "▲ 20 spots";
  }

  .bin:nth-of-type(1),
  .bin:nth-of-type(5) {
    font-size: 17px;
  }

  .bin:nth-of-type(2),
  .bin:nth-of-type(4) {
    font-size: 13px;
  }

  .bin:nth-of-type(3) {
    display: none;
    font-size: 10px;
  }

  @media only screen and (min-width: 1024px) {
    h3 {
      margin-bottom: 2em;
    }

    .bins {
      flex-direction: row;
      align-items: flex-start;
    }

    .bin {
      width: 10em;
      margin: 0 0.5em;
      position: relative;
      display: flex;
      flex-wrap: wrap;
    }

    .bin:nth-of-type(3) p {
      width: calc(50% - 0.5em);
    }

    .bin:before {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      transform: translate(0, -100%);
      padding: 0.5em;
      font-size: 14px;
      text-align: center;
      font-weight: var(--bold);
    }

    p {
      width: 100%;
    }

    .bin:nth-of-type(1),
    .bin:nth-of-type(5) {
      font-size: 20px;
    }

    .bin:nth-of-type(2),
    .bin:nth-of-type(4) {
      font-size: 15px;
    }

    .bin:nth-of-type(3) {
      display: flex;
      width: 20em;
      font-size: 12px;
    }
  }
</style>
