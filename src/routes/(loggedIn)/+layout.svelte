<script lang="ts">
	import 'svelte-ripple-action/ripple.css';
	import 'carta-md/default.css';
	import { pwaInfo } from 'virtual:pwa-info';

	import { xpStore } from '$lib/store.svelte';
	import { onMount } from 'svelte';
	import AppShell from '$lib/ui/AppShell.svelte';

	const { children, data } = $props();

	onMount(() => {
		xpStore.setInitial(data.xp?.points || 0);
	});

	let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<AppShell>
	{@render children()}
</AppShell>
