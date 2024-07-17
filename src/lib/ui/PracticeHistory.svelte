<script lang="ts">
	import type { PracticeHistoryItem } from '$lib/controllers/PracticeHistory';
	import Icon from '@iconify/svelte';
	import Button from './Button.svelte';

	let { items }: { items: PracticeHistoryItem[] } = $props();
</script>

<div class="space-y-4">
	{#each items as item}
		{#if item.quiz}
			<div class="rounded-lg border bg-white p-4 shadow">
				<div class="mb-2 flex items-center gap-2">
					<Icon icon="material-symbols:quiz" />

					<h3 class="text-lg font-semibold text-gray-800">{item.quiz.title}</h3>
				</div>

				<div class="mb-2">
					<p class="mb-1 text-sm text-gray-600">
						Completed a <b>quiz</b> with a score of <span class="font-medium">{item.points}</span>
					</p>

					<p class="text-xs text-gray-500">
						{new Date(item.date).toLocaleString()}
					</p>
				</div>

				<div class="flex justify-end gap-2">
					<Button link={`/notes/${item.quiz.note.id}`} size="sm">View note</Button>
					<Button link={`/practice/quizzes/${item.quiz.id}`} size="sm">View quiz</Button>
				</div>
			</div>
		{/if}

		{#if item.flashCard}
			<div class="rounded-lg border bg-white p-4 shadow">
				<div class="mb-2 flex items-center gap-2">
					<Icon icon="carbon:flash-filled" />

					<h3 class="text-lg font-semibold text-gray-800">{item.flashCard.title}</h3>
				</div>

				<div class="mb-2">
					<p class="mb-1 text-sm text-gray-600">
						Completed a <b>flashcard</b>
					</p>

					<p class="text-xs text-gray-500">
						{new Date(item.date).toLocaleString()}
					</p>
				</div>

				<div class="flex justify-end gap-2">
					<Button link={`/notes/${item.flashCard.note.id}`} size="sm">View note</Button>
					<Button link={`/practice/flashcards/${item.flashCard.id}`} size="sm">
						View flashcards
					</Button>
				</div>
			</div>
		{/if}
	{/each}
</div>
