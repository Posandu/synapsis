<script lang="ts">
	import clsx from 'clsx';
	import Typography from './Typography.svelte';
	import Confetti from 'svelte-confetti';
	import Button from './Button.svelte';
	import { goBack } from '$lib/util';
	import type { PracticeHistoryItem } from '$lib/controllers/PracticeHistory';
	import PracticeHistory from './PracticeHistory.svelte';
	import BlankState from './BlankState.svelte';
	import { newQuizInitialStore } from '$lib/store.svelte';
	import { goto } from '$app/navigation';

	let {
		flashcards,
		title,
		history,
		noteID
	}: {
		flashcards: {
			front: string;
			back: string;
		}[];
		title: string;
		history: PracticeHistoryItem[];
		noteID: string;
	} = $props();

	let currentCard = $state(0);
	let flipped = $state(false);

	function flipCard() {
		flipped = !flipped;
	}

	let ended = $state(false);

	function nextCard() {
		flipped = false;

		const next = currentCard + 1;

		if (next < flashcards.length) {
			currentCard = next;
		}

		if (next === flashcards.length) {
			ended = true;
		}
	}
</script>

<div class="mb-8 flex w-full gap-4 align-baseline">
	<div class="flex items-baseline align-baseline">
		<Button
			onclick={() => {
				goBack('/practice/flashcards/');
			}}
			icon="mdi:arrow-left"
		></Button>
	</div>

	<div>
		<Typography variant="h1">{title}</Typography>

		<Typography variant="subtitle" class="mt-3 max-w-xl"
			>Memorize hard facts with flashcards.</Typography
		>
	</div>
</div>

<div class="mt-16 flex flex-col items-center">
	{#if ended}
		<Confetti />

		<div
			class="flex h-[220px] w-[350px] flex-col items-center justify-center rounded-xl bg-primary p-4 text-white"
		>
			<Typography variant="h4" class="mb-4 max-w-xs text-center text-white">Well done!</Typography>

			<Button
				size="sm"
				onclick={() => {
					newQuizInitialStore.addItem({
						id: noteID,
						title: title
					});

					goto('/practice/quizzes/new');
				}}
				class="mb-4"
			>
				Take a quiz
			</Button>
			<Button
				size="sm"
				onclick={() => {
					currentCard = 0;
					ended = false;
				}}
				class="mb-4"
			>
				Retake flashcards
			</Button>
		</div>
	{/if}

	{#if !ended}
		<button class="flashcard" onclick={flipCard}>
			<div class="flashcard__inner" class:flipped>
				<div class="flashcard__back transition-all {clsx(!flipped && 'opacity-0')}">
					{flipped ? flashcards[currentCard].back : ''}
				</div>

				<div class="flashcard__front">
					{flashcards[currentCard].front}
				</div>
			</div>
		</button>

		<div class="controls">
			<button class="btn btn-neutral" onclick={flipCard}>Flip</button>
			<button class="btn btn-neutral" onclick={nextCard}>Next</button>
		</div>

		<Typography variant="caption" class="mt-4">
			{currentCard + 1} / {flashcards.length}
		</Typography>
	{/if}
</div>

<Typography variant="subtitle" class="mb-4 mt-8">Need more practice?</Typography>

<Button link="/notes/{noteID}">View the note</Button>

<Typography variant="h4" class="mb-4 mt-8">Activity</Typography>

{#if history.length > 0}
	<PracticeHistory items={history} />
{:else}
	<BlankState desc="Practice something to see your practice history here." />
{/if}

<style>
	.flashcard {
		width: 350px;
		height: 220px;
		perspective: 1000px;
		cursor: pointer;
		border: none;
		background: none;
		padding: 0;
		margin-bottom: 20px;
	}

	.flashcard__inner {
		width: 100%;
		height: 100%;
		transition: transform 1s ease;
		transform-style: preserve-3d;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		border-radius: 20px;
	}

	.flashcard__inner.flipped {
		transform: rotateY(180deg);
	}

	.flashcard__front,
	.flashcard__back {
		width: 100%;
		height: 100%;
		position: absolute;
		backface-visibility: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 20px;
		padding: 30px;
		box-sizing: border-box;
		font-size: 1.4rem;
		text-align: center;
		overflow: hidden;
	}

	.flashcard__front {
		background: linear-gradient(135deg, #3498db, #2980b9);
		color: #fff;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
	}

	.flashcard__back {
		background: linear-gradient(135deg, #2ecc71, #27ae60);
		color: #fff;
		transform: rotateY(180deg);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
	}

	.flashcard__front::before,
	.flashcard__back::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
		transform: rotate(30deg);
	}

	.controls {
		margin-top: 1.5rem;
		display: flex;
		gap: 1rem;
	}
</style>
