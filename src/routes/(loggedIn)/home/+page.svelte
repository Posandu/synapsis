<script lang="ts">
	import DidYouKnow from '$lib/ui/DidYouKnow.svelte';
	import PointsPerDayChart from '$lib/ui/PointsPerDayChart.svelte';
	import PracticedComparisonChart from '$lib/ui/PracticedComparisonChart.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { getGreeting } from '$lib/util.js';
	import { goto } from '$app/navigation';

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
	};
</script>

<Typography variant="h2" class="mb-4">{getGreeting()}, {data.user!.username}!</Typography>
<Typography variant="h3" class="mb-4 mt-8">Stats</Typography>
<Typography variant="subtitle" class="mb-4 max-w-xl">
	Here's a breakdown of how much you've practiced each note. The more you practice, the more you
	remember - so keep practicing!
</Typography>

<div class="grid grid-cols-3 gap-4">
	<div class="col-span-1 flex rounded-lg border p-4 shadow">
		<PracticedComparisonChart
			practiced={data.practicedCount}
			notPracticed={data.nonPracticedCount}
		/>
	</div>

	<div class="col-span-1 flex items-center justify-center rounded-lg border p-4 shadow">
		<PointsPerDayChart data={mask(data.pointsHistory.map((i) => i.points))} />
	</div>

	<div class="col-span-1 p-4">
		<DidYouKnow />
	</div>
</div>
