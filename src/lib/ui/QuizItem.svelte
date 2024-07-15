<script lang="ts">
	import type { Quiz } from '@prisma/client';
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

	let {
		quiz
	}: {
		quiz: Pick<Quiz, 'id' | 'title'> & {
			note: { title: string; id: string };
		};
	} = $props();
</script>

<div class="rounded-lg bg-white p-4 shadow">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<div class="text-lg font-semibold">{quiz.title}</div>
			<div class="text-xs text-gray-500">{quiz.note.title}</div>
		</div>
		<div class="flex gap-2">
			<Button variant="primary">Start</Button>
			<Button variant="secondary">Edit</Button>
		</div>
	</div>
</div>
