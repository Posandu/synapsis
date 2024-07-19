<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import Input from '$lib/ui/Input.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import { fetcher, goBack, screamToTheVoid, wait } from '$lib/util';
	import clsx from 'clsx';
	import {
		newFlashcardInitialStore,
		newNoteInitialCategoryStore,
		newQuizInitialStore
	} from '$lib/store.svelte';
	import toast from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import debounce from 'debounce';
	import Note from '$lib/ui/Note.svelte';
	import BlankState from '$lib/ui/BlankState.svelte';
	import autosize from 'svelte-autosize';
	import { onMount, tick } from 'svelte';

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

	let title = $state(data.category.name);
	let previousTitle = $state(data.category.name);

	let selectMenu = $state<HTMLElement | undefined>();
	let selectMenuSticky = $state(false);

	const updateTitle = async (newTitle: string) => {
		const res = await fetcher(`/api/categories`, {
			method: 'PATCH',
			body: JSON.stringify({ id: data.category.id, name: newTitle })
		});

		if (res.success) {
			previousTitle = newTitle;
		} else {
			throw new Error();
		}
	};

	const debouncedUpdate = debounce(() => {
		toast.promise(updateTitle(title), {
			loading: 'Updating category name...',
			error: 'An error occurred while updating the category name.',
			success: 'Category name updated successfully.'
		});
	}, 500);

	$effect(() => {
		if (title == previousTitle) return;

		debouncedUpdate();
	});

	$effect(() => {
		const observer = new IntersectionObserver(
			([e]) => (selectMenuSticky = e.intersectionRatio < 1),
			{ threshold: [1] }
		);

		if (selectMenu) {
			observer.observe(selectMenu);
		}

		return () => {
			if (selectMenu) {
				observer.unobserve(selectMenu);
			}
		};
	});

	const deleteCat = async () => {
		if (
			!confirm(
				'Are you sure you want to delete this category? Everything in this category will be lost.'
			)
		) {
			return;
		}

		if (data.notes.length > 0) {
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

	onMount(() => tick().then(() => window.dispatchEvent(new Event('resize'))));
</script>

<div class="mb-8 w-full gap-4 align-baseline md:flex">
	<div class="flex items-baseline align-baseline">
		<Button
			onclick={() => {
				goBack('/notes');
			}}
			icon="mdi:arrow-left"
		></Button>
	</div>

	<div class="flex flex-col">
		<textarea
			bind:value={title}
			class="flex-wrap text-4xl font-bold text-black"
			rows="1"
			use:autosize
		></textarea>

		<Typography variant="subtitle" class="mt-3 max-w-xl">
			{data.notes.length} notes in this category
		</Typography>
	</div>

	<div
		class="mt-8 flex flex-1 flex-row-reverse items-start gap-2 overflow-hidden md:mt-0 md:flex-row md:items-baseline"
	>
		<Button
			variant={deleting ? 'primary' : 'ghost'}
			onclick={() => {
				deleteCat();
			}}
			disabled={deleting}
			loading={deleting}
			class="flex-1"
		>
			Delete category
		</Button>

		<Button
			variant="primary"
			class="flex-1 md:w-[80px]"
			onclick={() => {
				selectItemsOpen = !selectItemsOpen;

				if (!selectItemsOpen) {
					selectedItems = [];
				}
			}}
			disabled={data.notes.length < 1}
		>
			{selectItemsOpen ? 'Cancel' : 'Select'}
		</Button>

		<Button
			variant="primary"
			link="/notes/new"
			class="flex-1"
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
	<div
		class="sticky -top-[1px] z-50 mb-4 items-baseline justify-between bg-base-100 py-2 md:flex {clsx(
			selectMenuSticky && 'border-b'
		)}"
		bind:this={selectMenu}
	>
		<Typography variant="subtitle">
			Selected {selectedItems.length} note{selectedItems.length > 1 ? 's' : ''}
		</Typography>

		<div
			class="mt-4 flex flex-row-reverse justify-end gap-2 md:mt-0 md:flex-row md:items-baseline md:justify-normal"
		>
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
				class="{clsx(selectedItems.length < 1 && 'tooltip tooltip-bottom')} flex gap-2"
				data-tip="At least one note must be selected to perform this action."
			>
				<Button
					size="sm"
					disabled={selectedItems.length < 1}
					variant="primary"
					onclick={() => {
						selectedItems.forEach((id) =>
							newQuizInitialStore.addItem({
								id,
								title: data.notes.find((note) => note.id === id)!.title
							})
						);

						goto('/practice/quizzes/new');
					}}
				>
					Make quiz
				</Button>

				<Button
					size="sm"
					disabled={selectedItems.length < 1}
					variant="primary"
					onclick={() => {
						selectedItems.forEach((id) =>
							newFlashcardInitialStore.addItem({
								id,
								title: data.notes.find((note) => note.id === id)!.title
							})
						);

						goto('/practice/flashcards/new');
					}}
				>
					Make flashcards
				</Button>
			</div>
		</div>
	</div>
{/if}

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each filtered as note}
		{@const selected = selectedItems.includes(note.id)}

		<Note
			note={{
				createdAt: note.createdAt,
				id: note.id,
				title: note.title,
				updatedAt: note.updatedAt,
				quiz: note.quiz?.id,
				flashcard: note.flashCard?.id
			}}
			{selected}
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
		/>
	{/each}
</div>

{#if !filtered.length}
	<BlankState desc="Try creating a new one instead?">
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
	</BlankState>
{/if}
