<script>
  import Scatter from "$components/Scatter.svelte";
  import Table from "$components/Table.svelte";
  import Could from "$components/Could.svelte";
  import Histogram from "$components/Histogram.svelte";
  import Teams from "$components/Teams.svelte";
  // import Footer from "$components/Footer.svelte";
  import data from "$data/clean.js";
</script>

<Histogram {data} />
<Could {data} />
<Teams {data} />
<Scatter data={data.filter((d) => d.minutes >= 1000)} />
<Table rows={data} />
