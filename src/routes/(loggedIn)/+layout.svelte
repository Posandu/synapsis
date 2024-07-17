<script lang="ts">
	import 'svelte-ripple-action/ripple.css';
	import 'carta-md/default.css';

	import { xpStore } from '$lib/store.svelte';
	import { onMount } from 'svelte';
	import AppShell from '$lib/ui/AppShell.svelte';

	const { children, data } = $props();

	onMount(() => {
		xpStore.setInitial(data.xp?.points || 0);
	});
</script>

<AppShell>
	{@render children()}
</AppShell>
