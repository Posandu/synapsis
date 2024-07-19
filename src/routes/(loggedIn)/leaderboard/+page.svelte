<script lang="ts">
	import BlankState from '$lib/ui/BlankState.svelte';
	import Typography from '$lib/ui/Typography.svelte';

	let { data } = $props();
</script>

<div class="mx-auto max-w-xs rounded-xl border p-8 shadow">
	<Typography variant="h1">Leaderboard</Typography>
	<Typography variant="subtitle" class="mb-4 mt-2">Top 10 learners today</Typography>

	{#if data.top10.length > 0}
		<div class="flex flex-col space-y-4">
			{#each data.top10 as item}
				<p class="flex justify-between">
					<span>{item.user.username}</span>
					<span>{item.points}</span>
				</p>
			{/each}
		</div>
	{:else}
		<BlankState
			desc="Looks like no one has earned any points today. This is your chance to be on the top of the leaderboard!"
		/>
	{/if}
</div>
