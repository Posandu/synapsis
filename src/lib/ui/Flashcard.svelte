<script lang="ts">
	import clsx from 'clsx';
	import Typography from './Typography.svelte';
	import Confetti from 'svelte-confetti';

	let {
		flashcards
	}: {
		flashcards: {
			front: string;
			back: string;
		}[];
	} = $props();

	let currentCard = $state(0);
	let flipped = $state(false);

	function flipCard() {
		flipped = !flipped;
	}

	function nextCard() {
		flipped = false;
		currentCard = (currentCard + 1) % flashcards.length;
	}
</script>

<div class="flex flex-col items-center">
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

	{#if currentCard === flashcards.length - 1}
		<Confetti />
	{/if}

	<div class="controls">
		<button class="btn btn-neutral" onclick={flipCard}>Flip</button>
		<button class="btn btn-neutral" onclick={nextCard}>Next</button>
	</div>

	<Typography variant="caption" class="mt-4">
		{currentCard + 1} / {flashcards.length}
	</Typography>
</div>

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
