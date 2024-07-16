<script lang="ts">
	import type { FlashCard } from '@prisma/client';
	import Button from './Button.svelte';
	import Typography from './Typography.svelte';
	import { fetcher } from '$lib/util';
	import toast from 'svelte-french-toast';

	let {
		flashcard,
		class: className = '',
		deleteCallBack
	}: {
		flashcard: Pick<FlashCard, 'id' | 'title'> & {
			note?: { title: string; id: string };
		};
		class?: string;
		deleteCallBack: () => void;
	} = $props();

	const deleteflashcards = async () => {
		if (!confirm('Are you sure you want to delete this flashcard?')) return;

		const res = await fetcher(`/api/flashcard`, {
			method: 'DELETE',
			body: JSON.stringify({ id: flashcard.id })
		});

		if (res.success) {
			toast.success('flashcard deleted successfully');

			deleteCallBack();
		} else {
			toast.error('Failed to delete flashcards');
		}
	};
</script>

<div class="flex flex-col rounded-lg border bg-white p-4 shadow {className}">
	<Typography variant="h4" class="mb-2 font-medium">
		{flashcard.title}

		<div class="tooltip" data-tip="Points gained from the last attempt"></div>
	</Typography>

	{#if flashcard.note}
		<div class="mb-4 flex items-center gap-2">
			<Typography variant="subtitle" class="text-gray-500">
				Generated using "{flashcard.note.title}" note
			</Typography>
		</div>
	{/if}

	<div class="join mt-auto w-full flex-1 items-end">
		<Button
			size="sm"
			variant="primary"
			class="join-item flex-1"
			link="/practice/flashcards/{flashcard.id}"
		>
			Start
		</Button>

		{#if flashcard.note}
			<Button
				size="sm"
				class="btn-outline join-item min-w-max flex-1"
				link="/notes/{flashcard.note.id}"
			>
				Read Note
			</Button>
		{/if}

		<Button
			size="sm"
			class="btn-outline join-item flex-1"
			onclick={() => {
				deleteflashcards();
			}}
		>
			Delete
		</Button>
	</div>
</div>
