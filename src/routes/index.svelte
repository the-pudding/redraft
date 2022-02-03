<script context="module">
  export const prerender = true;
  import copy from "$data/doc.json";
</script>

<script>
  import Meta from "$components/Meta.svelte";
  import App from "$components/App.svelte";
</script>

<Meta title={copy.title} description={copy.description} url={copy.url} />
<App />
