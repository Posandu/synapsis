<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '@iconify/svelte';
	import Typography from './Typography.svelte';

	let {
		desc = 'Add some items to see them here.',
		children
	}: { desc?: string; children?: Snippet } = $props();
</script>

<div class="flex h-96 flex-col items-center justify-center gap-2 rounded-xl bg-base-200">
	<Icon icon="uil:desert" class="text-6xl opacity-40" />

	<Typography variant="h3">Nothing to see here</Typography>

	<Typography variant="subtitle">{desc}</Typography>

	{#if children}
		{@render children()}
	{/if}
</div>
