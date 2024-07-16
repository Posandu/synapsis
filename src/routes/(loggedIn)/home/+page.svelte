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
</script>

<Typography variant="h2" class="mb-4">{getGreeting()}, {data.user!.username}!</Typography>
<Typography variant="h3" class="mb-4 mt-8">Stats</Typography>
<Typography variant="subtitle" class="mb-4 max-w-xl">
	Here's a breakdown of how much you've practiced each note. The more you practice, the more you
	remember - so keep practicing!
</Typography>

<div class="grid grid-cols-3 gap-4">
	<div class="col-span-1 flex rounded-lg border p-4 shadow">
		<PracticedComparisonChart practiced={40} notPracticed={60} />
	</div>
	<div class="col-span-1 flex items-center justify-center rounded-lg border p-4 shadow">
		<PointsPerDayChart data={[10, 0, 0, 50, 2]} />
	</div>
	<div class="col-span-1 p-4">
		<DidYouKnow />
	</div>
</div>

<div class="h-10"></div>
