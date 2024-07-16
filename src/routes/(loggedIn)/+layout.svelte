<script lang="ts">
	import { xpStore } from '$lib/store.svelte';
	import { onMount } from 'svelte';

	const { children, data } = $props();

	onMount(() => {
		xpStore.setInitial(data.xp?.points || 0);
	});
</script>

{@render children()}
