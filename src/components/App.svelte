<script>
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import Scatter from "$components/Scatter.svelte";
  import Table from "$components/Table.svelte";
  import Could from "$components/Could.svelte";
  import Histogram from "$components/Histogram.svelte";
  import Teams from "$components/Teams.svelte";
  import Method from "$components/Method.svelte";
  import TeamSelect from "$components/TeamSelect.svelte";

  // import Footer from "$components/Footer.svelte";
  import data from "$data/clean.js";
  import locate from "$utils/locate.js";
  import getFandom from "$utils/getFandom.js";

  const MIN = 1000;
  let location;
  let selectedTeam = {};
  let teamData = writable({});

  $: fan = location ? getFandom(location) : {};
  $: $teamData.name = selectedTeam.name ? selectedTeam.name : fan.name;
  $: $teamData.abbr = selectedTeam.abbr ? selectedTeam.abbr : fan.abbr;
  $: $teamData.city = selectedTeam.city ? selectedTeam.city : fan.city;
  $: context = { teamData };
  $: setContext("App", context);

  onMount(async () => {
    try {
      location = await locate(window.location.href.includes("localhost"));
    } catch (err) {
      location = {};
      console.log(err);
    }
  });
</script>

<section id="intro">
  <h1>The NBA Redrafted <mark>2.0</mark></h1>
  <p>
    Five years ago we <a href="https://pudding.cool/2017/03/redraft/" target="_blank"
      >redrafted the NBA</a
    > with data. We figured it was time to add more recent drafts and take it for a fresh spin.
  </p>
  {#if fan}
    <p>
      So lets begin. I'm guessing you are a fan of the {fan.name}? No shame in admitting it. But if
      not...
    </p>
    <p><TeamSelect bind:team={selectedTeam} /></p>
  {/if}
</section>

<section id="could">
  <p>
    Hindsight is 20/20, but it probably stings a bit to see what could have been for {$teamData.city}.
  </p>
  {#if $teamData.abbr}
    <Could {data} />
  {/if}
  <p>
    You might be wondering, where do these swaps come from? The short version: each player gets a
    score from a blend of four advanced stats based on their top five seasons. An upgrade pick is
    then found (based who was drafted lower with a higher score), and the players with the biggest
    upgrade difference are shown.
  </p>
  <p>
    <details>
      <summary>Some more details and notes</summary>
      <div>Don't fight me, fight the data. It isn't perfect nor is it meant to be.</div>
    </details>
  </p>
</section>

<section id="teams">
  <h2>Drafting is hard. Here is how often each team selects the best player available.</h2>
  <Teams {data} />
  <p>
    There are a couple contributing factors other than drafting prowess that make for teams like the
    Spurs apparent dominance. First, teams that draft higher on average (like the Clippers) have
    more room for error since there are more players they are passing on. Second, teams might just
    be better at player development.
  </p>
</section>

<!-- <Scatter {data} /> -->
<section id="histogram">
  <Histogram {data} />
</section>

<section id="method">
  <Method {data} />
</section>

<!-- <Table rows={data} /> -->
<style>
  section {
    margin: 2em auto;
  }

  h1,
  h2,
  p {
    max-width: 40rem;
    margin: 1rem auto;
  }

  h1 {
    font-size: 3em;
    text-transform: uppercase;
  }

  h2 {
    font-size: 2em;
  }

  p {
    font-size: 1.5em;
  }
</style>
