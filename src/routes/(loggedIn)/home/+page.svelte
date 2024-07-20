<script lang="ts">
	import DidYouKnow from '$lib/ui/DidYouKnow.svelte';
	import PointsPerDayChart from '$lib/ui/PointsPerDayChart.svelte';
	import PracticedComparisonChart from '$lib/ui/PracticedComparisonChart.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { getGreeting } from '$lib/util.js';
	import { goto } from '$app/navigation';
	import BlankState from '$lib/ui/BlankState.svelte';
	import PracticeHistory from '$lib/ui/PracticeHistory.svelte';
	import { onMount } from 'svelte';
	import introJs from 'intro.js';
	import { introStore } from '$lib/store.svelte.js';

	let { data } = $props();

	$effect(() => {
		if (data.user) goto('/home');
	});

	const mask = (arr: number[]): [number, number, number, number, number] => {
		const len = arr.length;

		if (len < 5) {
			return [...arr, ...new Array(5 - len).fill(0)] as [number, number, number, number, number];
		}

		return arr as [number, number, number, number, number];
	}; // don't touch this

	$effect(() => {
		(async () => {
			if (introStore.started && !introStore.isCompleted('/home')) {
				const instance = await introJs().start();

				instance.onbeforeexit(async () => {
					introStore.complete('/home');

					return true;
				});
			}
		})();
	});
</script>

<Typography variant="h2" class="mb-4">{getGreeting()}, {data.user!.username}!</Typography>
<Typography variant="h3" class="mb-4 mt-8">Stats</Typography>
<Typography variant="subtitle" class="mb-4 max-w-xl">
	Here's a breakdown of how much you've practiced each note. The more you practice, the more you
	remember - so keep practicing!
</Typography>

<div
	class="grid gap-4 md:grid-cols-3"
	data-intro="This is your dashboard, here you can get a brief overview of your practice history."
	data-step="1"
>
	{#if data.practicedCount == 0 && data.nonPracticedCount == 0}
		<BlankState desc="You haven't practiced any notes yet!" />
	{:else}
		<div class="col-span-1 flex rounded-lg border p-4 shadow">
			<PracticedComparisonChart
				practiced={data.practicedCount}
				notPracticed={data.nonPracticedCount}
			/>
		</div>
	{/if}

	<div class="col-span-1 flex items-center justify-center rounded-lg border p-4 shadow">
		<PointsPerDayChart data={mask(data.pointsHistory.map((i) => i.points))} />
	</div>

	<div class="col-span-1 p-4">
		<DidYouKnow />
	</div>
</div>

<Typography variant="h3" class="mb-4 mt-8">History</Typography>

<section
	data-intro="And this is your practice history. Here you can see how much you've practiced each note."
	data-step="2"
>
	{#if data.history.length > 0}
		<PracticeHistory items={data.history} />
	{:else}
		<BlankState desc="Practice something to see your practice history here." />
	{/if}
</section>
