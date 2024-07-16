<script lang="ts">
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import Typography from './Typography.svelte';

	let {
		onclick = undefined,
		class: className = '',
		children = undefined,
		selected = false,
		withLink = true,
		note
	}: {
		onclick?: (event: MouseEvent) => void;
		class?: string;
		children?: Snippet;
		selected?: boolean;
		note: {
			id: string;
			title: string;
			createdAt?: Date;
			updatedAt?: Date;
			quiz?: string | null;
			flashcard?: string | null;
		};
		withLink?: boolean;
	} = $props();
</script>

{#snippet content()}
	<Typography variant="h4" class="mb-2 {clsx(selected && 'text-white')} font-medium opacity-95">
		{note.title}
	</Typography>

	<div>
		{#if note.quiz}
			<span class="badge badge-ghost">Quiz</span>
		{/if}

		{#if note.flashcard}
			<span class="badge badge-ghost">Flashcard</span>
		{/if}
	</div>

	{#if note.updatedAt && note.createdAt}
		<div class="h-6"></div>

		<Typography variant="subtitle" class="mt-auto">
			Last edited on {new Date(note.updatedAt || note.createdAt).toLocaleString()}
		</Typography>
	{/if}

	{#if children}{@render children()}{/if}
{/snippet}

{#if withLink}
	<a
		class="flex flex-col rounded-box border p-4 shadow-sm transition-all hover:shadow-lg {clsx(
			selected && 'border-primary bg-primary text-white',
			className
		)}"
		href="/notes/{note.id}"
		{onclick}
	>
		{@render content()}
	</a>
{:else}
	<div
		class="flex flex-col rounded-box border p-4 shadow-sm transition-all {clsx(
			selected && 'border-primary bg-primary text-white',
			className
		)}"
	>
		{@render content()}
	</div>
{/if}
