<script>
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import WIP from "$components/helpers/WIP.svelte";
  import Scatter from "$components/Scatter.svelte";
  import Could from "$components/Could.svelte";
  import Histogram from "$components/Histogram.svelte";
  import Teams from "$components/Teams.svelte";
  import Method from "$components/Method.svelte";
  import TeamSelect from "$components/TeamSelect.svelte";

  import Footer from "$components/Footer.svelte";
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

<WIP />
<section id="intro">
  <div class="prose">
    <h1>The NBA Redrafted <mark>2.0</mark></h1>
    <p class="byline">
      By <a href="https://pudding.cool/authors/russell-goldenberg" target="_blank"
        >Russell Goldenberg</a
      > | Feb. 2022
    </p>
    <p>
      Five years ago we <a href="https://pudding.cool/2017/03/redraft/" target="_blank"
        >redrafted the NBA</a
      > with data. We figured it was time to update with more recent drafts, and ask some new questions.
    </p>
    {#if fan}
      <p>
        So let's begin. Hmm...I'm guessing you are a fan of the <strong>{fan.name}?</strong> No shame
        in admitting it. But if not...
      </p>
      <p><TeamSelect bind:team={selectedTeam} /></p>
    {/if}
  </div>
</section>

<section id="could">
  <div class="prose">
    <h2>
      Hindsight is 20/20, but it probably stings a bit to see what could have been for {$teamData.city}.
    </h2>
  </div>
  {#if $teamData.abbr}
    <Could {data} />
  {/if}
  <div class="prose">
    <p>
      Where do these swaps come from? The short version: each player gets a score from a blend of
      four advanced stats based on their top five seasons. The upgrade pick is a player that was
      drafted lower but has a higher score. Squads are made up of the biggest score upgrades. See
      the <a href="#method">method section</a> for more details.
    </p>
  </div>
</section>

<section id="teams">
  <div class="prose">
    <h2>
      Drafting is hard. Here is how often each team selects the best player available in the first
      round.
    </h2>
    <p class="dek">Select a team below to see their player report card.</p>
  </div>
  <Teams {data} />
  <div class="prose">
    <p>
      A draftee's grade is based on how big of a gap there is between their score and the best
      player available. More recent draftees will have less extremes scores since their best
      production seasons are still ahead of them. For example, while Markelle Fultz appears to be a
      bust, he is being compared to Tatum/Mitchell, who will likely widen that score gap as they hit
      their primes.
    </p>
    <p>
      Teams like the Clippers tend to draft higher on average. This makes it a bit harder for them
      than other teams to always pick right, but that can only explain away some of their results.
    </p>
  </div>
</section>

<!-- <Scatter {data} /> -->
<section id="histogram">
  <div class="prose">
    <h2>The over and underacheivers of every modern NBA draft class through 2017</h2>
  </div>
  <Histogram {data} />
  <div class="prose">
    <p>Tk some chatter.</p>
  </div>
</section>

<section id="method">
  <div class="prose">
    <h2>Data and Methods</h2>
    <p>
      The four advanced stats used to create a player's score were <a href="#">VORP</a>,
      <a href="#">Win Shares</a>, <a href="#">RAPTOR WAR</a>, and <a href="#">Wins Added</a>. No
      all-in-one advanced stat is perfect, so I chose a blend that satisfied the eye test (see
      <a href="#method-table">table below</a>).Each stat was normalized to a 1-100 then averaged
      together to create a master scale. Scores were based on a player's top five seasons to find
      the balance between prime and longevity (an average NBA career is 4.5 years). Upgrade choices
      in the Could Have Been teams were first selected from top 10 picks, then searched beyond those
      if there weren't enough.
    </p>
    <p>TK report grade calculation.</p>
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
</style>
