<script lang="ts">
	import { xpStore } from '$lib/store.svelte.js';
	import BlankState from '$lib/ui/BlankState.svelte';
	import Button from '$lib/ui/Button.svelte';
	import PracticeHistory from '$lib/ui/PracticeHistory.svelte';
	import Quiz from '$lib/ui/Quiz.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { goBack } from '$lib/util.js';

	let { data } = $props();
</script>

<div class="mb-8 flex w-full gap-4 align-baseline">
	<div class="flex items-baseline align-baseline">
		<Button
			onclick={() => {
				goBack('/practice/quizzes/');
			}}
			icon="mdi:arrow-left"
		></Button>
	</div>

	<div>
		<Typography variant="h1">{data.quiz.title}</Typography>

		<Typography variant="subtitle" class="mt-3 max-w-xl">Answer the questions below.</Typography>
	</div>
</div>

<Quiz data={data.quiz.data as any} id={data.quiz.id} />

<Typography variant="subtitle" class="mb-4 mt-8">Need more practice?</Typography>

<Button link="/notes/{data.quiz.noteID}">View the note</Button>

<Typography variant="h4" class="mb-4 mt-8">Activity</Typography>

{#if data.history.length > 0}
	<PracticeHistory items={data.history} />
{:else}
	<BlankState desc="Practice something to see your practice history here." />
{/if}
