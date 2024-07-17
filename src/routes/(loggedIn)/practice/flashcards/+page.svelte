<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Button from '$lib/ui/Button.svelte';
	import DidYouKnow from '$lib/ui/DidYouKnow.svelte';
	import QuizItem from '$lib/ui/QuizItem.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { goBack } from '$lib/util';
	import Tutorial from '$lib/img/makeQuiz.png';
	import BlankState from '$lib/ui/BlankState.svelte';
	import Flashcard from '$lib/ui/Flashcard.svelte';
	import FlashcardItem from '$lib/ui/FlashcardItem.svelte';

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
		<Typography variant="h1" class="mb-2">Flashcards</Typography>

		<Typography variant="subtitle" class="mt-3 max-w-xl">
			Practice with flashcards generated from your notes.
		</Typography>
	</div>
</div>

<Typography variant="h3" class="mb-2">How to create flashcards?</Typography>

<div class="mb-8 flex items-center gap-8">
	<div class="mb-6 max-w-sm text-sm opacity-80">
		Create flashcards directly from your notes. Select multiple notes and click <span
			class="btn btn-primary btn-xs pointer-events-none">Make Flashcard</span
		>
		or use the <span class="btn btn-primary btn-xs pointer-events-none">Make Flashcard</span> button on the note page.
	</div>

	<iframe
		src="https://www.youtube.com/embed/nZ15jw3NOO8?autoplay=1&mute=1&controls=0"
		frameborder="0"
		allow="autoplay; encrypted-media"
		allowfullscreen
		title="How to create quizzes"
		class="h-80 w-auto min-w-96 flex-1 rounded-lg border"
	>
	</iframe>
</div>

<Typography variant="h3" class="mb-2">Generated Flashcards</Typography>
<Typography variant="subtitle" class="mb-8">
	Flashcards generated from your notes will appear here.
</Typography>

{#if data.flashcards.length === 0}
	<BlankState desc="Create quizzes from your notes to see them here." />
{:else}
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each data.flashcards as flashcard}
			<FlashcardItem
				{flashcard}
				deleteCallBack={() => {
					invalidate('flashcards:data');
				}}
			/>
		{/each}
	</div>
{/if}
