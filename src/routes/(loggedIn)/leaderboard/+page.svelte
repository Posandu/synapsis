<script lang="ts">
	import BlankState from '$lib/ui/BlankState.svelte';
	import Typography from '$lib/ui/Typography.svelte';

	let { data } = $props();
</script>

<div class="max-w-xs p-8 mx-auto shadow border rounded-xl">
	<Typography variant="h1">Leaderboard</Typography>
	<Typography variant="subtitle" class="mb-4 mt-2">Top 10 learners today</Typography>

	{#if data}
		<div class="flex flex-col space-y-4">
			{#each data.top10 as item}
				<p class="flex justify-between">
					<span>{item.user.username}</span>
					<span>{item.points}</span>
				</p>
			{/each}
		</div>
	{:else}
		<BlankState desc="No data available" />
	{/if}
</div>
