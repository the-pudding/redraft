<script>
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import Scatter from "$components/Scatter.svelte";
  import Table from "$components/Table.svelte";
  import Could from "$components/Could.svelte";
  import Histogram from "$components/Histogram.svelte";
  import Teams from "$components/Teams.svelte";
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

{#if fan}
  <p>I'm guessing you are a fan of the {fan.name}?</p>
  <p>Not your jam? Try another: <TeamSelect bind:team={selectedTeam} /></p>
{/if}

{#if $teamData.abbr}
  <Could {data} />
{/if}
<!-- <Teams {data} /> -->
<!-- <Scatter {data} /> -->
<!-- <Histogram {data} /> -->

<!-- <Table rows={data} /> -->
