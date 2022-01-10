<script>
  import Scatter from "$components/Scatter.svelte";
  import Table from "$components/Table.svelte";
  import Could from "$components/Could.svelte";
  import Histogram from "$components/Histogram.svelte";
  import Teams from "$components/Teams.svelte";
  // import Footer from "$components/Footer.svelte";
  import data from "$data/clean.js";

  // console.table(data.filter((d) => d.year === 1994));
  const MIN = 1000;
</script>

<Could {data} />
<!-- <Histogram {data} /> -->
<!-- <Teams {data} /> -->
<!-- <Scatter data={data} /> -->
<!-- <Table rows={data} /> -->
