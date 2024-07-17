<script lang="ts">
	import type { Quiz } from '@prisma/client';
	import Button from './Button.svelte';
	import Typography from './Typography.svelte';
	import { fetcher } from '$lib/util';
	import toast from 'svelte-french-toast';

	let {
		quiz,
		class: className = '',
		deleteCallBack
	}: {
		quiz: Pick<Quiz, 'id' | 'title' | 'points'> & {
			note?: { title: string; id: string };
		};
		class?: string;
		deleteCallBack: () => void;
	} = $props();

	const deleteQuiz = async () => {
		if (!confirm('Are you sure you want to delete this quiz?')) return;

		const res = await fetcher(`/api/quiz`, {
			method: 'DELETE',
			body: JSON.stringify({ id: quiz.id })
		});

		if (res.success) {
			toast.success('Quiz deleted successfully');

			deleteCallBack();
		} else {
			toast.error('Failed to delete quiz');
		}
	};
</script>

<div class="flex flex-col rounded-lg border bg-white p-4 shadow {className}">
	<Typography variant="h4" class="mb-2 font-medium">
		{quiz.title}

		<div class="tooltip" data-tip="Points gained from the last attempt">
			<span class="badge badge-neutral">
				{quiz.points || 0} points
			</span>
		</div>
	</Typography>

	{#if quiz.note}
		<div class="mb-4 flex items-center gap-2">
			<Typography variant="subtitle" class="text-gray-500">
				Generated using "{quiz.note.title}" note
			</Typography>
		</div>
	{/if}

	<div class="join mt-auto w-full flex-1 items-end">
		<Button
			size="sm"
			variant="primary"
			class="join-item min-w-max flex-1"
			link="/practice/quizzes/{quiz.id}"
		>
			Start Quiz
		</Button>

		{#if quiz.note}
			<Button size="sm" class="btn-outline join-item min-w-max flex-1" link="/notes/{quiz.note.id}">
				Read Note
			</Button>
		{/if}

		<Button
			size="sm"
			class="btn-outline join-item flex-1"
			onclick={() => {
				deleteQuiz();
			}}
		>
			Delete
		</Button>
	</div>
</div>
