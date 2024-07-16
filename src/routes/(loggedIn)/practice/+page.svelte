<script lang="ts">
	import BlankState from '$lib/ui/BlankState.svelte';
	import DidYouKnow from '$lib/ui/DidYouKnow.svelte';
	import PointsPerDayChart from '$lib/ui/PointsPerDayChart.svelte';
	import PracticedComparisonChart from '$lib/ui/PracticedComparisonChart.svelte';
	import PracticeHistory from '$lib/ui/PracticeHistory.svelte';
	import Typography from '$lib/ui/Typography.svelte';

	let { data } = $props();
</script>

<Typography variant="h1" class="mb-3">Practice</Typography>
<Typography variant="subtitle" class="mb-4 max-w-xl">
	Recall and reinforce what you've learned. Give those brain cells a workout - practice makes
	memories stick!
</Typography>

<div class="grid grid-cols-3 gap-4">
	<a
		href="/practice/recall"
		class="col-span-1 rounded-lg border border-pink-200 bg-pink-50 p-5 text-center transition-all hover:shadow-lg"
	>
		<img
			class="mx-auto mb-4"
			width="48"
			height="48"
			src="https://img.icons8.com/external-outline-geotatah/64/external-feasibility-product-management-outline-geotatah.png"
			alt="external-feasibility-product-management-outline-geotatah"
		/>

		<Typography variant="h3" class="mt-2 text-pink-950">Recall</Typography>
		<Typography variant="subtitle" class="mt-2 text-pink-950">
			Type out what you remember from memory, and check how much you got right.
		</Typography>
	</a>

	<a
		href="/practice/quizzes"
		class="col-span-1 rounded-lg border border-purple-200 bg-purple-50 p-5 text-center shadow transition-all hover:shadow-lg"
	>
		<img
			class="mx-auto mb-4"
			width="48"
			height="48"
			src="https://img.icons8.com/ios/50/quiz.png"
			alt="quiz"
		/>

		<Typography variant="h3" class="mt-2 text-purple-950">Quiz</Typography>
		<Typography variant="subtitle" class="mt-2 text-purple-950">
			The good ol' quiz. Test your knowledge and see how much you've learned.by taking a quiz.
		</Typography>
	</a>

	<a
		href="/practice/flashcards"
		class="col-span-1 rounded-lg border border-blue-200 bg-blue-50 p-5 text-center transition-all hover:shadow-lg"
	>
		<img
			class="mx-auto mb-4"
			width="48"
			height="48"
			src="https://img.icons8.com/ios/50/cat-eyes.png"
			alt="cat-eyes"
		/>

		<Typography variant="h3" class="mt-2 text-blue-950">Flashcards</Typography>
		<Typography variant="subtitle" class="mt-2 text-blue-950">
			Flashcards are a great way to memorize information. Test yourself with flashcards.
		</Typography>
	</a>
</div>

<Typography variant="h3" class="mb-4 mt-8">Practice History</Typography>

{#if data.history.length > 0}
	<PracticeHistory items={data.history} />
{:else}
	<BlankState desc="Practice something to see your practice history here." />
{/if}
