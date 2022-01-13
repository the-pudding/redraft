<script>
  import { scaleLinear, extent } from "d3";
  import { onMount, getContext, tick } from "svelte";
  import viewport from "$stores/viewport.js";
  import Range from "$components/helpers/Range.svelte";
  // import ButtonSet from "$components/helpers/ButtonSet.svelte";

  export let data;

  let graphicEl;
  let activeYear;
  let figureW = 0;
  const yProp = "moved";
  const xProp = "norm_blend";

  const extentX = extent(data, (d) => d[xProp]);
  const extentY = extent(data, (d) => d[yProp]);

  $: w = Math.min(figureW, $viewport.width) * 0.8;
  $: h = Math.min(figureW, $viewport.height) * 0.8;
  $: x = scaleLinear().domain(extentX).range([0, 100]);
  $: y = scaleLinear().domain([-extentY[1], extentY[1]]).range([100, 0]);
  $: xTicks = x.ticks(w < 400 ? 4 : 8);
  $: yTicks = y.ticks(h < 400 ? 4 : 8);
  $: extentYears = extent(data, (d) => d.season);
</script>

<div class="graphic" bind:this={graphicEl}>
  <figure bind:clientWidth={figureW}>
    <div class="ui">
      <div class="range">
        <Range
          min={extentYears[0]}
          max={extentYears[1]}
          showTicks={true}
          step={1}
          bind:value={activeYear}
        />
      </div>
      <!-- <div class="buttonset">
        <ButtonSet options={[{ value: "winner" }, { value: "loser" }]} bind:value={figurePlace} />
      </div> -->
    </div>
    <div class="chart" style="width: {w}px; height: {h}px;">
      <div class="axis x">
        {#each xTicks as tick}
          <div class="tick" style="left: {x(tick)}%">
            <p>{tick}</p>
            <span style="height: {h}px;" />
          </div>
        {/each}
      </div>

      <div class="axis y">
        {#each yTicks as tick}
          <div class="tick" style="top: {y(tick)}%">
            <p>{tick}</p>
            <span style="width: {w}px;" />
          </div>
        {/each}
      </div>

      <div class="players">
        {#each data as p}
          <div
            class="player"
            class:visible={true}
            style="left: {x(p[xProp])}%; top: {y(p[yProp])}%;"
          >
            <div
              style="width: {8 + Math.abs(p[yProp])}px; height: {8 + Math.abs(p[yProp])}px;"
              class="dot"
            >
              <!-- <img src="assets/headshots/{p.id}.png" alt="" /> -->
            </div>
            <p class="name">{p.name}</p>
          </div>
        {/each}
      </div>
    </div>
  </figure>
</div>

<style>
  .graphic {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .prose {
    max-width: 25em;
    width: 100%;
    flex: 1;
  }

  figure {
    flex: 1;
    padding: 1em;
    font-family: var(--mono);
  }

  .ui {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
  }

  .buttonset {
    width: 100%;
    margin-top: 0.5em;
    text-align: center;
  }

  .range {
    flex: 1;
    width: 100%;
    max-width: 20em;
    margin: 0 auto;
  }

  .range:before {
    content: "Season";
    display: block;
    font-size: var(--font-small);
    text-align: center;
  }

  .display-team {
    /* max-width: 20em; */
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -150%);
    font-size: var(--font-small);
    background-color: var(--color-highlight);
    padding: 0.25em;
  }

  .display-team p {
    margin: 0;
    text-align: center;
    line-height: 1.2;
    white-space: nowrap;
  }

  .chart {
    position: relative;
    margin: 3em auto;
    cursor: crosshair;
  }

  .player {
    position: absolute;
    user-select: none;
  }

  .dot {
    width: 0.25em;
    height: 0.25em;
    background: var(--color-gray-300);
    border-radius: 50%;
    transform: translate(50%, -50%);
    pointer-events: none;
  }

  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }

  .name {
    position: absolute;
    margin: 0;
    font-size: var(--font-small);
    top: 0;
    left: 50%;
    transform: translate(-50%, -150%);
    white-space: nowrap;
    /* text-shadow: -1px -1px 1px white, 1px 1px 1px white, 1px -1px 1px white, -1px 1px 1px white; */
    display: none;
    pointer-events: none;
    background: var(--color-green);
    padding: 0.25em;
    line-height: 1;
    border: 2px solid var(--color-white);
  }

  .visible {
    z-index: 1000;
    display: block;
    opacity: 1;
  }

  .visible .dot {
    background: var(--color-black);
    border: 2px solid var(--color-white);
    pointer-events: auto;
  }

  .visible .name {
    /* display: block; */
  }

  :global(.visible .name.overlap) {
    opacity: 0;
  }

  .player.visible:hover {
    z-index: 1000;
  }

  .player.visible:hover .dot {
    background: var(--color-black);
  }

  .player.visible:hover p {
    display: block;
    opacity: 1;
  }

  .axis {
    position: absolute;
    left: 0;
    top: 0;
    color: var(--color-gray-700);
  }

  .axis.x {
    top: auto;
    bottom: 0;
    width: 100%;
  }

  .axis.x:before {
    content: "PRODUCTION";
    display: block;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    transform: translate(0, 150%);
    font-size: 12px;
  }

  .axis.y {
    height: 100%;
  }

  .axis.y:before {
    content: "SPOTS MOVED";
    display: block;
    text-align: center;
    position: absolute;
    white-space: nowrap;
    top: 50%;
    left: 0;
    width: 100%;
    transform: rotate(-90deg) translate(0, -200%);
    font-size: 12px;
  }

  .axis .tick {
    position: absolute;
    top: 0;
    left: 0;
    line-height: 1;
  }

  .axis.x .tick {
    transform: translate(-50%, 0);
  }

  .axis.y .tick {
    transform: translate(-75%, 0);
  }

  .axis span {
    position: absolute;
  }

  .axis.x span {
    top: 0;
    left: 50%;
    transform: translate(0, -100%);
    width: 1px;
    border-right: 1px dashed var(--color-gray-300);
  }

  .axis.y span {
    top: 50%;
    right: 0;
    height: 1px;
    transform: translate(100%, -100%);
    border-bottom: 1px dashed var(--color-gray-300);
  }

  .axis .tick p {
    margin: 0;
    font-size: 12px;
    display: inline-block;
    line-height: 1;
  }

  .axis .tick:first-of-type {
    display: none;
  }

  .axis.x .tick p {
    padding-top: 8px;
  }

  .axis.y .tick p {
    padding-right: 12px;
    text-align: right;
  }

  :global(.prose button) {
    /* padding: 0; */
  }

  .prose p {
    display: none;
  }

  .prose p:first-of-type {
    display: block;
  }

  p.download {
    margin: 0;
    text-align: center;
  }

  a {
    font-size: 12px;
    text-transform: uppercase;
  }

  @media only screen and (min-width: 960px) {
    .graphic {
      flex-direction: row;
    }

    .prose p {
      display: block;
    }

    .ui {
      padding: 0 1.5em;
      flex-direction: row;
    }

    .range {
      margin-right: 2em;
      width: auto;
    }

    .buttonset {
      width: auto;
    }

    .chart {
      margin: 2em auto;
    }

    .display-team {
      top: 2em;
      left: 1.5em;
      transform: translate(0, 0);
    }
  }
</style>
