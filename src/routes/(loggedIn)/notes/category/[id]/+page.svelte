<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import Input from '$lib/ui/Input.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { fetcher, goBack, wait } from '$lib/util';
	import clsx from 'clsx';
	import { newNoteInitialCategoryStore } from '$lib/store.svelte';
	import toast from 'svelte-french-toast';
	import { goto } from '$app/navigation';

	const { data } = $props();

	let search = $state('');
	let filtered = $derived(
		search.trim()
			? data.notes.filter((note) => note.title.toLowerCase().includes(search.toLowerCase()))
			: data.notes
	);

	let selectItemsOpen = $state(false);
	let selectedItems = $state<string[]>([]);
	let deleting = $state(false);

	const deleteCat = async () => {
		if (
			!confirm(
				'Are you sure you want to delete this category? Everything in this category will be lost.'
			)
		) {
			return;
		}

		if (
			!confirm(
				'Are you really sure? **Everything** (including notes) in this category will be lost. You can delete the notes individually or move them to another category if you want to keep them.'
			)
		) {
			return;
		}

		const type = 'delete-' + data.category.name + '-' + Math.floor(Math.random() * 1000);
		const inp = prompt('Type "' + type + '" to confirm deletion.');

		if (inp !== type) {
			alert('The confirmation text did not match.');

			return;
		}

		deleting = true;

		await wait(2000);

		const res = await fetcher(`/api/categories`, {
			method: 'DELETE',
			body: JSON.stringify({ id: data.category.id })
		});

		if (res.success) {
			toast.success('Category deleted successfully.');

			await goto('/notes');
		} else {
			toast.error('An error occurred while deleting the category.');

			deleting = false;
		}
	};
</script>

<div class="mb-8 flex w-full gap-4 align-baseline">
	<div class="flex items-baseline align-baseline">
		<Button
			onclick={() => {
				goBack('/notes');
			}}
			icon="mdi:arrow-left"
		></Button>
	</div>

	<div class="flex-1">
		<Typography variant="h1">{data.category?.name}</Typography>

		<Typography variant="subtitle" class="mt-3 max-w-xl">
			{data.notes.length} notes in this category
		</Typography>
	</div>

	<div class="flex items-baseline gap-2">
		<Button
			variant={deleting ? 'primary' : 'ghost'}
			onclick={() => {
				deleteCat();
			}}
			disabled={deleting}
			loading={deleting}
		>
			Delete Category
		</Button>

		<Button
			variant="primary"
			onclick={() => {
				selectItemsOpen = !selectItemsOpen;
			}}
		>
			{selectItemsOpen ? 'Cancel selection' : 'Select notes'}
		</Button>

		<Button
			variant="primary"
			link="/notes/new"
			onclick={() => {
				newNoteInitialCategoryStore.update({
					id: data.category.id,
					name: data.category.name,
					userId: data.user!.id
				});
			}}
		>
			New Note
		</Button>
	</div>
</div>

<div class="mb-4">
	<Input placeholder="Search notes" bind:value={search} />
</div>

{#if selectItemsOpen}
	<div class="sticky top-0 z-50 mb-4 flex items-baseline justify-between border-b bg-base-100 py-2">
		<Typography variant="subtitle">
			Selected {selectedItems.length} note{selectedItems.length > 1 ? 's' : ''}
		</Typography>

		<div class="flex items-baseline gap-2">
			<Button
				variant="ghost"
				size="sm"
				onclick={() => {
					selectedItems = [];
					selectItemsOpen = false;
				}}
			>
				Clear
			</Button>

			<div
				class="tooltip tooltip-bottom"
				data-tip={selectedItems.length == 1
					? `
                Recall the note from memory and write it down. 
                Then compare it with the original note to see what you missed.
            `
					: `
                Only one note can be selected for this action.
            `}
			>
				<Button size="sm" variant="primary" disabled={selectedItems.length !== 1}>
					Memory Echo
				</Button>
			</div>

			{#snippet Actions()}
				<Button size="sm" disabled={selectedItems.length < 1} variant="primary">Make quiz</Button>
				<Button size="sm" disabled={selectedItems.length < 1} variant="primary">
					Make flashcards
				</Button>
			{/snippet}

			{#if selectedItems.length < 1}
				<div
					class="tooltip tooltip-bottom flex gap-2"
					data-tip="At least one note must be selected to perform this action."
				>
					{@render Actions()}
				</div>
			{:else}
				{@render Actions()}
			{/if}
		</div>
	</div>
{/if}

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each filtered as note}
		{@const selected = selectedItems.includes(note.id)}

		<a
			class="flex flex-col rounded-box border p-4 shadow-sm transition-all hover:shadow-lg {clsx(
				selected && 'border-primary bg-primary text-white'
			)}"
			href="/notes/{note.id}"
			onclick={(e) => {
				if (selectItemsOpen) {
					e.preventDefault();

					if (selectedItems.includes(note.id)) {
						selectedItems = selectedItems.filter((id) => id !== note.id);
					} else {
						selectedItems = [...selectedItems, note.id];
					}
				}
			}}
		>
			<Typography variant="h4" class="mb-2 {clsx(selected && 'text-white')} font-medium opacity-95">
				{note.title}
			</Typography>

			<div class="h-6"></div>

			<Typography variant="subtitle" class="mt-auto">
				Last edited on {new Date(note.updatedAt || note.createdAt).toLocaleString()}
			</Typography>
		</a>
	{/each}
</div>

{#if !filtered.length}
	<div class="flex h-96 w-full flex-col items-center justify-center rounded-lg bg-base-200">
		<Typography variant="h3" class="mb-3">No notes found</Typography>
		<Typography variant="subtitle">Try creating a new one instead?</Typography>

		<div class="h-4"></div>

		<Button
			link="/notes/new"
			onclick={() => {
				newNoteInitialCategoryStore.update({
					id: data.category.id,
					name: data.category.name,
					userId: data.user!.id
				});
			}}
			variant="primary"
		>
			New Note
		</Button>
	</div>
{/if}

<div class="h-10"></div>
