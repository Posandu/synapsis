<script lang="ts">
	import { xpStore } from '$lib/store.svelte';
	import {
		fetcher,
		getFeedbackMessage,
		validateWrittenAnswer,
		XP,
		type QuizQuestion
	} from '$lib/util';
	import Confetti from 'svelte-confetti';

	let {
		data,
		id
	}: {
		data: {
			title: string;
			questions: (QuizQuestion & {
				__svelteInputVal?: string;
				__correct?: boolean;
			})[];
		};
		id: string;
	} = $props();

	let currentQuestion = $state(-1);
	let score = $state(0);
	let scorePercentage = $derived((score / data.questions.length) * 100);
	let quizCompleted = $derived(currentQuestion === -2);
	let tracked = false;

	const track = () => {
		const perc = (score / data.questions.length) * 100;

		fetcher('/api/quiz', {
			method: 'PATCH',
			body: JSON.stringify({
				id,
				score: perc
			})
		});

		xpStore.addXP(perc > 50 ? XP.QUIZ_COMPLETED : 0);
	};

	$effect(() => {
		if (quizCompleted && !tracked) {
			track();

			tracked = true;
		}
	});
</script>

<div class="relative flex min-h-[500px] flex-col overflow-hidden rounded-lg border bg-blue-900">
	<div
		class="absolute top-0 h-1 bg-white"
		style="width: {((currentQuestion + 1) / data.questions.length) * 100}%"
	></div>

	{#if currentQuestion === -2}
		<div class="flex flex-1 flex-col items-center justify-center">
			<h1 class="p-4 text-center text-3xl font-bold text-white">{data.title}</h1>

			<p class="max-w-2xl p-4 text-center text-lg text-white">
				{getFeedbackMessage(scorePercentage)}
			</p>

			{#if scorePercentage > 75}
				<Confetti />
			{/if}

			<p class="p-4 text-center text-lg text-white">
				You scored {score} out of {data.questions.length} ({scorePercentage}%).
			</p>

			<div class="max-h-48 space-y-2 overflow-auto rounded-lg bg-white/20 py-4">
				{#each data.questions as question, i}
					<div class="flex gap-2 px-4">
						<div class="flex-1 items-baseline text-sm text-white">
							{i + 1}. {question.question}
						</div>

						{#if question.__correct}
							<span class="text-sm font-semibold text-green-200"> Correct</span>
						{:else}
							<span class="text-sm font-semibold text-red-200"> Incorrect</span>
						{/if}
					</div>
				{/each}
			</div>

			<button class="btn btn-secondary mt-4" onclick={() => window.location.reload()}>
				Restart Quiz
			</button>
		</div>
	{/if}

	{#if currentQuestion == -1}
		<div class="flex flex-1 flex-col items-center justify-center">
			<h1 class="p-4 text-center text-3xl font-bold text-white">{data.title}</h1>

			<p class="p-4 text-center text-lg text-white">
				Welcome to the quiz! Click the button below to start.
			</p>

			<button class="btn btn-secondary" onclick={() => (currentQuestion = 0)}> Start Quiz </button>
		</div>
	{/if}

	{#each data.questions as question, i}
		{#if i === currentQuestion}
			<div class="aniIn flex flex-1 flex-col items-center justify-center">
				<h2 class="select-none p-4 text-center text-2xl font-bold text-white">
					{question.question}
				</h2>

				{#if question.type === 'multiple-choice'}
					<div class="flex flex-col items-center justify-center space-y-2">
						{#each question.options as option}
							<button
								class="block w-full rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/15 active:bg-white/20"
								onclick={() => {
									if (option === question.optionAnswer) {
										score += 1;

										data.questions[i].__correct = true;
									}

									if (i === data.questions.length - 1) {
										currentQuestion = -2;
									} else {
										currentQuestion += 1;
									}
								}}
							>
								{option}
							</button>
						{/each}
					</div>
				{:else if question.type === 'written'}
					<textarea
						class="h-32 w-full max-w-xl p-4 text-black"
						placeholder="Enter your answer here..."
						bind:value={question.__svelteInputVal}
					></textarea>

					<button
						class="btn btn-secondary mt-4"
						onclick={() => {
							if (validateWrittenAnswer(question.__svelteInputVal || '', question.answerKeywords)) {
								score += 1;

								data.questions[i].__correct = true;
							}

							if (i === data.questions.length - 1) {
								currentQuestion = -2;
							} else {
								currentQuestion += 1;
							}
						}}
					>
						Submit Answer
					</button>
				{/if}
			</div>
		{/if}
	{/each}
</div>

<style>
	.aniIn {
		animation: pop 400ms cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	@keyframes pop {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		50% {
			transform: scale(1.05);
			opacity: 0.5;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
