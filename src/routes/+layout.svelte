<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.css';
	import 'svelte-ripple-action/ripple.css';
	import 'carta-md/default.css';
	import { Toaster } from 'svelte-french-toast';
	import AppShell from '$lib/ui/AppShell.svelte';

	export let data;
</script>

<Toaster />

{#if data.user}
	<AppShell>
		<slot></slot>
	</AppShell>
{:else}
	<slot></slot>
{/if}
