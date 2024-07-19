<script lang="ts">
	import type { Category } from '@prisma/client';
	import { Confetti } from 'svelte-confetti';
	import { Dialog } from 'bits-ui';
	import { fade, scale } from 'svelte/transition';
	import { Carta, MarkdownEditor } from 'carta-md';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { fetcher, goBack, wait } from '$lib/util';
	import { goto } from '$app/navigation';
	import Button from '$lib/ui/Button.svelte';
	import Typography from '$lib/ui/Typography.svelte';
	import DOMPurify from 'isomorphic-dompurify';
	import Icon from '@iconify/svelte';
	import Categories from '$lib/ui/Categories.svelte';
	import ImageScan from '$lib/ui/ImageScan.svelte';
	import toast from 'svelte-french-toast';
	import type { PageData } from '../../routes/(loggedIn)/notes/new/$types';
	import {
		newFlashcardInitialStore,
		newNoteInitialCategoryStore,
		newQuizInitialStore
	} from '$lib/store.svelte';
	import QuizItem from './QuizItem.svelte';
	import FlashcardItem from './FlashcardItem.svelte';
	import autosize from 'svelte-autosize';
	import { onMount, tick } from 'svelte';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	let value = $state('');
	let loading = $state(false);
	let loaded = $state(false);

	let selectCategoryDialogOpen = $state(false);
	let selectedCategory = $state<Category | null>(null);

	let scanDialogOpen = $state(false);
	let scanDialogContent = $state('');
	let scanDialogLoading = $state(false);

	let fixingErrorsLoading = $state(false);

	let quizDeleted = $state(false);
	let flashCardDeleted = $state(false);

	let {
		data,
		initialValues
	}: {
		data: PageData;
		initialValues?: {
			title: string;
			content: string;
			category: Category;
			id: string;
			quiz?: any;
			flashCard?: any;
		};
	} = $props();

	const fixErrors = async () => {
		fixingErrorsLoading = true;

		const resp = await fetcher<string>('/api/notes/fixerrors', {
			method: 'POST',
			body: JSON.stringify({ text: value.trim() })
		});

		if (resp.success) {
			toast.success('Errors fixed successfully!');

			value = resp.data;
		} else toast.error(resp.message || 'Failed to fix errors. Please try again.');

		fixingErrorsLoading = false;
	};

	const deleteNote = async () => {
		if (!initialValues) {
			toast.error('Note not found. Please try again.');
			return;
		}

		const confirmed = confirm('Are you sure you want to delete this note?');

		if (!confirmed) return;

		const resp = await fetcher<string>('/api/notes/delete', {
			method: 'DELETE',
			body: JSON.stringify({ id: initialValues.id })
		});

		if (resp.success) {
			toast.success('Note deleted successfully!');

			await wait(800);

			goBack('/notes');
		} else toast.error(resp.message || 'Failed to delete note. Please try again.');
	};

	const { form, errors, enhance, message } = superForm(data.form, {
		dataType: 'json',
		onSubmit: () => {
			loading = true;
		},
		onResult: (res) => {
			loading = false;

			if (res.result.type == 'success') {
				loaded = true;

				setTimeout(() => {
					loaded = false;
				}, 1000);
			}
		},
		clearOnSubmit: 'errors',
		multipleSubmits: 'prevent',
		resetForm: false
	});

	$effect(() => {
		if (initialValues) {
			value = initialValues.content;
			selectedCategory = initialValues.category;
			$form.title = initialValues.title;
		} else if (newNoteInitialCategoryStore.category) {
			selectedCategory = newNoteInitialCategoryStore.category;

			newNoteInitialCategoryStore.reset();
		}
	});

	$effect(() => {
		$form.content = value;
	});

	$effect(() => {
		if (selectedCategory?.id) $form.categoryID = selectedCategory.id;
	});

	$effect(() => {
		if (initialValues) return;

		(async () => {
			if ($message?.data) {
				await wait(800);

				await goto('/notes/' + $message.data.id);
			}
		})();
	});

	onMount(() => tick().then(() => window.dispatchEvent(new Event('resize'))));
</script>

{#snippet SelectCategoryDialog()}
	<Dialog.Root bind:open={selectCategoryDialogOpen}>
		<Dialog.Portal class="flex items-center justify-center">
			<Dialog.Overlay
				transition={fade}
				transitionConfig={{ duration: 150 }}
				class="fixed inset-0 z-50 bg-black/80"
			/>

			<Dialog.Content
				transition={scale}
				transitionConfig={{ duration: 200, start: 0.9 }}
				class="fixed left-1/2 top-1/2 z-50 w-full max-w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-box bg-base-100 p-5 shadow-lg outline-none sm:max-w-[490px] md:w-full"
			>
				<Categories bind:selectedCategory />

				<div class="mt-4 flex justify-end gap-2">
					<Button
						variant="ghost"
						onclick={() => {
							selectCategoryDialogOpen = false;
						}}
					>
						Cancel
					</Button>

					<Button
						variant="primary"
						disabled={!selectedCategory}
						onclick={() => {
							selectCategoryDialogOpen = false;
						}}
					>
						Select
					</Button>
				</div>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
{/snippet}

{#snippet ScanNoteDialog()}
	<Dialog.Root bind:open={scanDialogOpen} closeOnEscape={false} closeOnOutsideClick={false}>
		<Dialog.Portal class="flex items-center justify-center">
			<Dialog.Overlay
				transition={fade}
				transitionConfig={{ duration: 150 }}
				class="fixed inset-0 z-50 bg-black/80"
			/>

			<Dialog.Content
				transition={scale}
				transitionConfig={{ duration: 200, start: 0.9 }}
				class="fixed left-1/2 top-1/2 z-50 w-full max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-box bg-base-100 p-5 shadow-lg outline-none md:w-full"
			>
				<ImageScan bind:content={scanDialogContent} bind:loading={scanDialogLoading} />

				{#if !scanDialogLoading}
					<div class="mt-4 flex justify-end gap-2">
						<Button
							variant="ghost"
							disabled={scanDialogLoading}
							onclick={() => {
								scanDialogOpen = false;

								const initial = value.trim();

								value = initial ? `${initial}\n\n${scanDialogContent}` : scanDialogContent;
							}}
						>
							Cancel
						</Button>

						<Button
							variant="primary"
							disabled={!scanDialogContent || scanDialogLoading}
							onclick={() => {
								scanDialogOpen = false;

								const initial = value.trim();

								value = initial ? `${initial}\n\n${scanDialogContent}` : scanDialogContent;
							}}
						>
							Insert
						</Button>
					</div>
				{/if}
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
{/snippet}

<form method="POST" use:enhance>
	<div class="mb-4 flex w-full gap-4 align-baseline">
		<div class="flex items-baseline align-baseline">
			<Button
				onclick={() => {
					goBack('/notes');
				}}
				icon="mdi:arrow-left"
			></Button>
		</div>

		<div class="flex flex-1 flex-col">
			<textarea
				class="mb-3 h-max min-h-0 w-full resize-none flex-wrap text-3xl font-bold text-black"
				placeholder="Title"
				bind:value={$form.title}
				rows={$form.title.split('\n').length}
				use:autosize
			></textarea>

			{#if $errors.title}
				<Typography variant="subtitle" class="text-error">Title is required</Typography>
			{/if}

			<Typography variant="subtitle" class="mb-4 max-w-xl">
				{initialValues
					? 'Editing a note...'
					: "Drop your notes here - type away or snap a pic! For now, we're text-only."}
			</Typography>
		</div>
	</div>

	<div class="gap-8 md:flex">
		<div class="relative flex-1">
			{#if $errors.content}
				<Typography variant="subtitle" class="text-error">Cannot publish an empty note</Typography>
			{/if}

			<MarkdownEditor
				placeholder="Type your note or scan an image"
				{carta}
				mode="tabs"
				bind:value
				disableToolbar
			/>
		</div>

		<div class="mt-8 w-60 md:mt-0">
			<Typography variant="h5" class="mb-3">{initialValues ? 'Update' : 'Publish'}</Typography>

			{#if !initialValues}
				<Typography variant="subtitle" class="mb-4 max-w-xl">
					Time to publish? Give it one last polish – typos are sneaky!
				</Typography>
			{/if}

			{#if loaded}<Confetti duration={1000} />{/if}

			<Button variant="primary" {loading} disabled={loading} type="submit">
				{initialValues ? 'Update' : 'Publish'} Note
			</Button>

			{#if initialValues}
				<Button variant="ghost" onclick={() => deleteNote()}>Delete Note</Button>
			{/if}

			<Typography variant="h5" class="mb-3 mt-6 flex items-center gap-2">
				Actions <Icon icon="ph:sparkle" />
			</Typography>

			<Button
				onclick={() => {
					scanDialogOpen = true;
				}}
			>
				Scan image
			</Button>

			<Button
				onclick={() => {
					fixErrors();
				}}
				disabled={fixingErrorsLoading}
				loading={fixingErrorsLoading}
			>
				Fix errors
			</Button>

			<Typography variant="h5" class="mb-3 mt-6">Category</Typography>
			<Typography variant="subtitle" class="mb-4 max-w-xl">
				Categorize your note for easy access later. You can add a new category if you don't find
				one.
			</Typography>

			<Button
				onclick={() => {
					selectCategoryDialogOpen = true;
				}}
			>
				Select category
			</Button>

			{#if $errors.categoryID}
				<Typography variant="subtitle" class="text-error">Please select a category</Typography>
			{/if}

			{#if selectedCategory}
				<Typography variant="h5" class="mb-3 mt-6">Selected Category</Typography>

				<Typography variant="subtitle" class="mb-4 max-w-xl">
					{selectedCategory.name}
				</Typography>
			{/if}

			{#if initialValues?.quiz && !quizDeleted}
				<QuizItem
					quiz={initialValues.quiz}
					deleteCallBack={() => {
						quizDeleted = true;
					}}
					class="mb-2"
				/>
			{:else if initialValues}
				<Button
					onclick={() => {
						newQuizInitialStore.addItem({
							id: initialValues?.id!,
							title: initialValues?.title!
						});

						goto('/practice/quizzes/new');
					}}
					class="mb-2"
				>
					Make quiz
				</Button>
			{/if}

			{#if initialValues?.flashCard && !flashCardDeleted}
				<FlashcardItem
					flashcard={initialValues.flashCard}
					deleteCallBack={() => {
						flashCardDeleted = true;
					}}
					class="mb-2"
				/>
			{:else if initialValues}
				<Button
					onclick={() => {
						newFlashcardInitialStore.addItem({
							id: initialValues?.id!,
							title: initialValues?.title!
						});

						goto('/practice/flashcards/new');
					}}
					class="mb-2"
				>
					Make flashcards
				</Button>
			{/if}
		</div>
	</div>
</form>

{@render SelectCategoryDialog()}
{@render ScanNoteDialog()}
