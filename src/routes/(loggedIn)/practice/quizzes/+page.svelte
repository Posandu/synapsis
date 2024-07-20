<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Button from '$lib/ui/Button.svelte';
	import QuizItem from '$lib/ui/QuizItem.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { goBack } from '$lib/util';
	import BlankState from '$lib/ui/BlankState.svelte';

	let { data } = $props();
</script>

<div class="mb-8 flex w-full gap-4 align-baseline">
	<div class="flex items-baseline align-baseline">
		<Button
			onclick={() => {
				goBack('/practice');
			}}
			icon="mdi:arrow-left"
		></Button>
	</div>

	<div class="flex-1">
		<Typography variant="h1" class="mb-2">Quizzes</Typography>

		<Typography variant="subtitle" class="mt-3 max-w-xl">
			Take random quizzes to test your knowledge. You can choose which notes to include in the quiz.
		</Typography>
	</div>
</div>

<Typography variant="h3" class="mb-2">How to create quizzes?</Typography>

<div class="mb-8 items-center gap-8 md:flex">
	<div class="mb-6 max-w-sm text-sm opacity-80">
		Create quizzes directly from your notes. Select multiple notes and click the <span
			class="btn btn-primary btn-xs pointer-events-none">Make Quiz</span
		>
		button, or use the <span class="btn btn-primary btn-xs pointer-events-none">Make Quiz</span> button
		on the note page.
	</div>

	<iframe
		src="https://youtube.com/embed/fP6AqClKfEE?autoplay=1&mute=1"
		frameborder="0"
		allow="autoplay; encrypted-media"
		allowfullscreen
		title="How to create quizzes"
		class="h-80 w-auto min-w-96 flex-1 rounded-lg border"
	>
	</iframe>
</div>

<Typography variant="h3" class="mb-2">Generated Quizzes</Typography>
<Typography variant="subtitle" class="mb-8">
	Quizzes generated from your notes will show up here.
</Typography>

{#if data.quizzes.length === 0}
	<BlankState desc="Create quizzes from your notes to see them here." />
{:else}
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each data.quizzes as quiz}
			<QuizItem
				{quiz}
				deleteCallBack={() => {
					invalidate('quiz:items');
				}}
			/>
		{/each}
	</div>
{/if}
