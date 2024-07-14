<script lang="ts">
	import NotePage from '$lib/ui/NotePage.svelte';

	let { data } = $props();
</script>

<NotePage {data} />
