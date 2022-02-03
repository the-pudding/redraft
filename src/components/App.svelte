<script>
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";

  import Could from "$components/Could.svelte";
  import Histogram from "$components/Histogram.svelte";
  import Teams from "$components/Teams.svelte";
  import Method from "$components/Method.svelte";
  import TeamSelect from "$components/TeamSelect.svelte";
  import Footer from "$components/Footer.svelte";
  import data from "$data/clean.js";
  import locate from "$utils/locate.js";
  import getFandom from "$utils/getFandom.js";
  import copy from "$data/doc.json";

  const MIN = 1000;
  let location;
  let selectedTeam = {};
  let fan = { name: "New York Knicks", abbr: "NYK", city: "New York" };
  let visibleStats;

  $: if (location) fan = getFandom(location) || fan;

  onMount(async () => {
    try {
      location = await locate(window.location.href.includes("localhost"));
    } catch (err) {
      location = {};
      console.log(err);
    }
  });
</script>

<!-- <WIP /> -->
<section id="intro">
  <div class="prose">
    <h1>The NBA Redrafted <mark>2.0</mark></h1>
    <p class="byline">
      By <a href="https://pudding.cool/authors/russell-goldenberg" target="_blank"
        >Russell Goldenberg</a
      > | Feb. 2022
    </p>
    <p>
      {@html copy.intro1}
    </p>
    {#if fan}
      <p>
        {@html copy.intro2A} <strong>{fan.name}?</strong>
        {@html copy.intro2B}
      </p>
    {/if}
  </div>
</section>

<section id="could">
  <div class="prose">
    <h2>
      {@html copy.couldTitle}
      <TeamSelect bind:team={selectedTeam} fan={fan.abbr} />
    </h2>
    <p class="dek">
      {#if selectedTeam.city}
        {selectedTeam.city}’{selectedTeam.city.endsWith("s") ? "" : "s"}
      {/if}
      <mark class="alt">actual picks</mark>
      and the
      <mark>better players</mark> available.
      <button class="btn-stats" on:click={() => (visibleStats = !visibleStats)}
        >{visibleStats ? "hide" : "show"} stats</button
      >
    </p>
  </div>
  {#if selectedTeam.name}
    <Could visible={visibleStats} {data} {selectedTeam} />
  {/if}
  <div class="prose">
    <p>
      {@html copy.could1}
    </p>
  </div>
</section>

<section id="teams">
  <div class="prose">
    <h2>
      {@html copy.teamsTitle}
    </h2>
    <p class="dek">{@html copy.teamsDek}</p>
  </div>
  <Teams {data} />
  <div class="prose">
    <p>
      {@html copy.teams1}
    </p>

    <p>
      {@html copy.teams2}
    </p>
  </div>
</section>

<!-- <Scatter {data} /> -->
<section id="histogram">
  <div class="prose">
    <h2>{@html copy.histogramTitle}</h2>
  </div>
  <Histogram {data} />
  <div class="prose">
    <p>{@html copy.histogram1}</p>
  </div>
</section>

<section id="method">
  <div class="prose">
    <h2>Data and Methods</h2>
    <p>{@html copy.method1}</p>
    <p>{@html copy.method2}</p>
    <p>{@html copy.method3}</p>
    <Method {data} />
  </div>
</section>

<Footer />

<style>
  #method .prose p {
    font-size: 1.25em;
  }

  .byline {
    font-size: 1em;
    color: var(--color-gray-500);
  }

  .dek {
    font-size: 1em;
    color: var(--color-gray-500);
  }

  :global(.prose em) {
    font-size: 0.85em;
  }

  .btn-stats {
    border: 2px solid var(--color-fg);
    padding: 0.25em;
    margin-top: 0.25em;
    width: 7em;
  }

  @media only screen and (min-width: 480px) {
    .btn-stats {
      margin-left: 0.5em;
      padding: 0.5em;
      display: inline-block;
    }
  }
</style>
