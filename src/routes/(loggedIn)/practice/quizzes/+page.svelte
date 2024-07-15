<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import DidYouKnow from '$lib/ui/DidYouKnow.svelte';
	import QuizItem from '$lib/ui/QuizItem.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { goBack } from '$lib/util';

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
			Random quizzes to test your knowledge. You can select notes to include in the quiz.
		</Typography>
	</div>

	<div class="flex items-baseline gap-2">
		<Button variant="primary">New Quiz</Button>
	</div>
</div>

<Typography variant="h3" class="mb-4">How to use quizzes?</Typography>

<div class="mb-6 mt-4 max-w-2xl text-sm opacity-80">
	Instead of using a seperate place to create quizzes, you can create quizzes directly from your
	notes. To create a quiz, select the notes you want to include in the quiz and click on the "New
	Quiz" button. You can also create a quiz from a single note by clicking on the "Create Quiz"
	button in the note page.
</div>

<Typography variant="h3" class="mb-4">Recent Quizzes</Typography>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each data.quizzes as quiz}
		<QuizItem {quiz} />
	{/each}
</div>
